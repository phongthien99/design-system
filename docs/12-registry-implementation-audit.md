# Registry Implementation Audit

Audit này kiểm tra repo hiện tại so với Registry Model Rules.

Cập nhật lần cuối: 2026-09-20. Tiến độ theo từng component và checklist release nằm ở [MVP Checklist](08-mvp-checklist.md).

## Snapshot kiểm tra ngày 2026-09-20

| Kiểm tra | Kết quả |
| --- | --- |
| `pnpm build` | Pass, 7/7 task, gồm Storybook build |
| `pnpm typecheck` | Pass (trước đó fail 39 lỗi TS2322 ở generated stories, đã sửa trong `registry/stories/playgrounds.tsx`) |
| `pnpm typecheck:registry` | Pass |
| `pnpm test` | Pass nhưng **không có test file nào** (`--passWithNoTests`) |
| `pnpm lint` | ESLint (`eslint .`) — pass. `pnpm format:check` (Prettier) cũng pass |
| `company-ui list` | Pass, liệt kê 42 item (41 `registry:ui` + `utils`) |
| `company-ui add button` trên product giả | Pass, ghi `lib/utils.ts`, `components/ui/button.tsx`, `company-ui.json`, cập nhật `package.json`; `check` báo `up to date` |

Giới hạn CLI phát hiện khi thử:

- `add` chỉ nhận một tên mỗi lệnh; `add button dialog` chỉ add `button`.
- `registry.json` được tìm ngược lên từ `--cwd`, nên product nằm ngoài repo này phải truyền `--registry <path>`.
- Dependency nội bộ như `@company/theme` được ghi vào `package.json` với version `latest`, trong khi package này đang `private` và chưa publish.

## Kết luận nhanh

Repo hiện tại đã có foundation tốt cho Design System và đã có **Registry Model MVP**.

Hiện trạng đã chuyển sang **Registry Model**:

```txt
@company/tokens
@company/theme
@company/primitives
@company/patterns
@company/icons
registry/company/ui
tooling/company-ui
apps/storybook
```

Registry Model MVP hiện dùng shadcn-compatible registry:

```txt
registry.json
registry/
  company/ui/registry.json
  company/ui/primitives/button/button.tsx
  company/ui/components/dialog/dialog.tsx
  stories/
tooling/company-ui/
templates/components.json
```

Còn thiếu cho production-ready:

```txt
hosted registry endpoint
schema validation gate
diff/update workflow
visual/a11y CI gate
real package-manager install after package.json update
```

## Rule-by-rule status

| Rule | Status | Ghi chú |
| --- | --- | --- |
| R1 - Tokens Shared | Done | Có `packages/tokens` với package `@company/tokens`. |
| R2 - Token là nguồn chuẩn | Partial | Có token và theme CSS variables. Rule `ds/no-hardcoded-token` (`tooling/eslint-plugin-ds`) chặn hard-code trong `pnpm lint`. |
| R3 - Semantic Tokens | Partial | Có semantic variables trong `packages/theme/src/styles.css`. Chưa chuẩn hóa đầy đủ tên như `--surface-default`, `--text-muted`. |
| R4 - Component Registry | Done | Có root `registry.json` và `registry/company/ui/registry.json` theo shadcn schema. |
| R5 - Source Distribution | Done | `company-ui add <name>` copy source vào Product theo `files[].target`. |
| R6 - CLI Installation | Done | Có `tooling/company-ui` với `list`, `add`, `check`. |
| R7 - Base UI là Primitive | Done | Có `packages/primitives` wrap `@base-ui/react` cho Dialog/Checkbox. |
| R8 - Không dùng Base UI trực tiếp | Partial | Product chưa tồn tại trong repo để enforce. Docs đã có rule. |
| R9 - Product sở hữu Source | Done | `company-ui add <name>` copy source vào Product theo target trong registry. |
| R10 - Dependency tự động | Partial | CLI tự thêm dependency vào `package.json`, chưa chạy package-manager install. |
| R11 - Không overwrite | Done | `add` không overwrite file có sẵn nếu không có `--force` (và `--force` không lan sang dependency). Có `diff`; `update` bỏ qua component ở trạng thái `conflict`. |
| R12 - Version Tracking | Done | Version từng item ở `meta.version` (sổ cái `registry/company/ui/versions.json`, công cụ `pnpm registry:bump/check/log`), version release cả registry là `@company/registry` (Changesets). CLI ghi vào `company-ui.json` `version`, `registryVersion` và hash baseline từng file. |
| R13 - Product chủ động update | Done | `check` so ba chiều (baseline, local, upstream) và phân biệt `update available`, `modified locally`, `conflict`; `diff` và `update` do Product tự chạy. |
| R14 - CI kiểm tra chuẩn | Partial | Có script `typecheck`, `test`, `build`, Storybook build nhưng chưa có workflow CI. Có a11y gate qua `pnpm test:storybook` nhưng chưa chạy trong CI; chưa có visual test. |
| R15 - Registry là source of truth | Done | Source chuẩn nằm trong `registry/company/ui`; `packages/ui` đã bị xóa. |
| R16 - Không dùng `@company/ui` | Done | Workspace không còn package `@company/ui`; Product rule yêu cầu import local source. |
| R17 - Xóa runtime UI package | Done | Đã gỡ `packages/ui` khỏi repo, Storybook, tsconfig và lockfile. |
| R18 - Component mới vào registry trước | Done | Registry cover toàn bộ public Base UI exports hiện tại. |
| R19 - Pattern không phụ thuộc runtime UI | Done | `@company/patterns` không còn dependency `@company/ui`. |

## Đã implement

### Tokens

Có:

```txt
packages/tokens
packages/tokens/src/index.ts
packages/tokens/src/tokens.css
```

Package:

```txt
@company/tokens
```

### Theme

Có:

```txt
packages/theme/src/styles.css
packages/theme/src/tailwind-preset.ts
```

Theme đã map token sang semantic CSS variables như:

```css
--color-background
--color-foreground
--color-primary
--color-muted-foreground
--color-border
--color-danger
```

### Base UI primitive layer

Có:

```txt
packages/primitives/src/dialog/index.ts
packages/primitives/src/checkbox/index.ts
```

Đang wrap:

```txt
@base-ui/react/dialog
@base-ui/react/checkbox
```

### UI registry components

`packages/ui` đã bị xóa. Source chuẩn nằm trong `registry/company/ui` và được chia theo taxonomy:

```txt
registry/company/ui/primitives
registry/company/ui/components
registry/company/ui/composites
registry/company/ui/utils
```

10 item hiện có style riêng (class `ds-*` trong `packages/theme/src/styles.css`):

```txt
registry/company/ui/primitives/button/button.tsx
registry/company/ui/components/input/input.tsx
registry/company/ui/components/checkbox/checkbox.tsx
registry/company/ui/components/dialog/dialog.tsx
registry/company/ui/composites/form-field/form-field.tsx
registry/company/ui/components/select/select.tsx
registry/company/ui/components/switch/switch.tsx
registry/company/ui/components/tabs/tabs.tsx
registry/company/ui/components/tooltip/tooltip.tsx
registry/company/ui/components/popover/popover.tsx
```

31 item còn lại là headless wrapper (xem bên dưới). Chưa có Table, Pagination, Textarea, Badge, Alert trong registry.

### Storybook

Có:

```txt
apps/storybook
```

Storybook đang load stories từ:

```txt
packages/patterns/src/**/*.stories.tsx
registry/stories/**/*.stories.tsx
```

Hiện có 41 story component (`registry/stories/generated`, mỗi component có `Overview` và `Playground`), story `Registry/All Components` và story `EmptyState`. Addon `docs`, `a11y`, `vitest` đã cài; a11y ở mức `error` (`pnpm test:storybook` fail nếu có violation axe).

### Shadcn-compatible registry

Có:

```txt
registry.json
registry/company/ui/registry.json
registry/company/ui/primitives/button/button.tsx
registry/company/ui/components/input/input.tsx
registry/company/ui/components/checkbox/checkbox.tsx
registry/company/ui/components/dialog/dialog.tsx
registry/company/ui/composites/form-field/form-field.tsx
registry/company/ui/utils/utils.ts
```

Registry đang dùng:

- `type: "registry:ui"` cho UI components.
- `type: "registry:lib"` cho `utils`.
- `dependencies` cho package dependency.
- `registryDependencies` cho dependency giữa registry items.
- `files[].target` với `@ui/` và `@lib/`.

Registry hiện cover toàn bộ 40 public Base UI component exports của `@base-ui/react@1.8.0` (cộng thêm `form-field` của Design System):

```txt
accordion
alert-dialog
autocomplete
avatar
button
checkbox
checkbox-group
collapsible
combobox
context-menu
csp-provider
dialog
direction-provider
drawer
field
fieldset
form
input
menu
menubar
meter
navigation-menu
number-field
otp-field
popover
preview-card
progress
radio
radio-group
scroll-area
select
separator
slider
switch
tabs
toast
toggle
toggle-group
toolbar
tooltip
```

Các component chưa được style riêng đang là headless wrappers dạng:

```tsx
export { Select } from "@base-ui/react/select";
```

Mục tiêu là Product có thể add source đầy đủ trước, sau đó Design System team nâng cấp từng item thành styled component/pattern theo roadmap.

### Company UI CLI

Có:

```txt
tooling/company-ui
```

Commands hiện có:

```bash
company-ui list
company-ui add button
company-ui check
```

CLI hiện hỗ trợ:

- Đọc root `registry.json`.
- Resolve `include`.
- Resolve `registryDependencies` nội bộ.
- Resolve target placeholder `@ui/`, `@components/`, `@lib/`, `@hooks/`.
- Copy source vào Product.
- Không overwrite nếu không có `--force`.
- Thêm dependency vào Product `package.json`.
- Ghi `company-ui.json` để tracking hash.

## Chưa implement

### Hosted registry endpoint

Chưa có endpoint thật dạng:

```txt
https://design.company.local/r/{name}.json
```

Hiện registry chạy local trong repo.

### Schema validation gate

Chưa validate bằng JSON schema hoặc `shadcn/schema` trong CI.

### Diff/update workflow

Đã có `check` ba chiều, `diff`, `update` (xem [Registry Model Rules](11-registry-model-rules.md#check)). Còn thiếu:

- `check` luôn thoát mã 0 kể cả khi có `conflict` hay `update available`, nên chưa dùng làm gate CI cho product được.
- `pnpm registry:check` (chặn item đổi mà chưa bump) chưa chạy trong CI. Mức bump do người chọn, công cụ không suy ra từ diff.
- `update` ghi lại cả file đã `up to date` (kết quả giống nhau, chỉ thêm dòng `Overwrote`).
- Chưa có test end-to-end cho luồng `add` → `check` → `update`; mới có unit test cho logic phân loại (`tooling/company-ui/src/tracking.test.ts`).

### Real package install

CLI mới cập nhật `package.json`, chưa chạy:

```bash
pnpm install
```

### Product registry state generated in real product

`company-ui.json` đã được generate khi chạy CLI, nhưng repo này chưa có product app thật để commit file đó.

### CLI nhận nhiều component

`company-ui add button input` chưa hoạt động, chỉ item đầu tiên được add.

### CI workflow

Chưa có workflow CI (GitHub Actions hoặc tương đương) chạy `lint`, `typecheck`, `test`, `build`. Typecheck đã xanh nên có thể bật gate.

### Test

Chưa có test file nào trong repo. Mục tiêu đầu tiên: Button, Input, Checkbox, Dialog.

### Visual/a11y gate

Chưa có visual regression tool. A11y đã bật chế độ chặn (`parameters.a11y.test = "error"`), chạy bằng `pnpm test:storybook`; chưa gắn vào CI.

## Roadmap tiếp theo

### Step 0 - Làm đủ gate hiện có

- Viết test đầu tiên để `pnpm test` không còn xanh vì không có test.
- Làm Table và Pagination cho đủ MVP.

### Step 1 - Dùng Product template

Product copy từ:

```txt
templates/components.json
```

### Step 2 - Validate registry schema

Validate bằng JSON schema hoặc API từ shadcn:

```ts
import { registryItemSchema, registrySchema } from "shadcn/schema";
```

### Step 3 - Add real install

```bash
company-ui add dialog
pnpm install
```

Hoặc CLI tự detect package manager và chạy install.

### Step 4 - Add diff/update

Implement:

```bash
company-ui diff button
company-ui update button
```

Update phải đi qua review, không auto overwrite.

### Step 5 - CI gates

Bổ sung:

- lint.
- typecheck.
- unit test.
- Storybook build.
- a11y test.
- visual regression.
