# Registry Implementation Audit

Audit này kiểm tra repo hiện tại so với Registry Model Rules.

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
  components/ui/button/button.tsx
  components/ui/dialog/dialog.tsx
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
| R2 - Token là nguồn chuẩn | Partial | Có token và theme CSS variables. Chưa có lint rule chặn hardcode. |
| R3 - Semantic Tokens | Partial | Có semantic variables trong `packages/theme/src/styles.css`. Chưa chuẩn hóa đầy đủ tên như `--surface-default`, `--text-muted`. |
| R4 - Component Registry | Done | Có root `registry.json` và `registry/company/ui/registry.json` theo shadcn schema. |
| R5 - Source Distribution | Done | `company-ui add <name>` copy source vào Product theo `files[].target`. |
| R6 - CLI Installation | Done | Có `tooling/company-ui` với `list`, `add`, `check`. |
| R7 - Base UI là Primitive | Done | Có `packages/primitives` wrap `@base-ui/react` cho Dialog/Checkbox. |
| R8 - Không dùng Base UI trực tiếp | Partial | Product chưa tồn tại trong repo để enforce. Docs đã có rule. |
| R9 - Product sở hữu Source | Done | `company-ui add <name>` copy source vào Product theo target trong registry. |
| R10 - Dependency tự động | Partial | CLI tự thêm dependency vào `package.json`, chưa chạy package-manager install. |
| R11 - Không overwrite | Partial | `add` không overwrite file nếu không có `--force`; chưa có `diff -> review -> apply`. |
| R12 - Version Tracking | Done | CLI ghi `company-ui.json` với hash của registry item. |
| R13 - Product chủ động update | Partial | Có `check` để báo update qua hash; chưa có `diff`/`update`. |
| R14 - CI kiểm tra chuẩn | Partial | Có `typecheck`, `test`, `build`, Storybook build. Chưa có visual test/a11y gate bắt buộc. |
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

`packages/ui` đã bị xóa. Source chuẩn hiện nằm trong:

```txt
registry/company/ui/button/button.tsx
registry/company/ui/input/input.tsx
registry/company/ui/checkbox/checkbox.tsx
registry/company/ui/dialog/dialog.tsx
registry/company/ui/form-field/form-field.tsx
```

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

### Shadcn-compatible registry

Có:

```txt
registry.json
registry/company/ui/registry.json
registry/company/ui/button/button.tsx
registry/company/ui/input/input.tsx
registry/company/ui/checkbox/checkbox.tsx
registry/company/ui/dialog/dialog.tsx
registry/company/ui/form-field/form-field.tsx
registry/company/ui/utils/utils.ts
```

Registry đang dùng:

- `type: "registry:ui"` cho UI components.
- `type: "registry:lib"` cho `utils`.
- `dependencies` cho package dependency.
- `registryDependencies` cho dependency giữa registry items.
- `files[].target` với `@ui/` và `@lib/`.

Registry hiện cover toàn bộ public Base UI component exports của `@base-ui/react@1.8.0`:

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

Chưa có logic:

```bash
company-ui diff button
company-ui update button
```

### Real package install

CLI mới cập nhật `package.json`, chưa chạy:

```bash
pnpm install
```

### Product registry state generated in real product

`company-ui.json` đã được generate khi chạy CLI, nhưng repo này chưa có product app thật để commit file đó.

### Diff/update workflow

Chưa có logic:

```txt
registry source
      vs
product source
      ↓
diff -> review -> apply
```

### CI visual/a11y gate

Chưa có visual regression tool hoặc a11y test runner bắt buộc trong CI.

## Roadmap tiếp theo

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
