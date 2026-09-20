# Registry Model Rules

## Mục tiêu

Registry Model dùng khi team muốn phát triển giống shadcn: component được quản lý tập trung trong Company UI Registry, sau đó CLI copy source vào Product.

Model này khác với runtime package model. Product không import `Button` từ package runtime như `@company/ui`; thay vào đó Product chạy CLI để copy source component vào codebase của Product.

## Kiến trúc

```txt
                  @company/tokens
                  Shared Package
                        |
                        v
Base UI ------> Company UI Registry
                        |
                   company-ui CLI
                        |
          company-ui add button
                        |
                        v
                 Product Source
```

## Rules

| Rule | Quy định |
| --- | --- |
| R1 - Tokens Shared | Design Tokens là package riêng `@company/tokens`, dùng chung cho tất cả Product. |
| R2 - Token là nguồn chuẩn | Color, spacing, typography, radius, shadow phải lấy từ `@company/tokens`; không hardcode nếu token đã tồn tại. |
| R3 - Semantic Tokens | Component ưu tiên `--color-primary`, `--text-muted`, `--surface-default` thay vì raw color. |
| R4 - Component Registry | UI Component được quản lý tập trung trong Company UI Registry. |
| R5 - Source Distribution | Component được copy source vào Product, không sử dụng component runtime từ CDN. |
| R6 - CLI Installation | Product lấy component bằng CLI: `company-ui add button`. |
| R7 - Base UI là Primitive | Registry có thể sử dụng Base UI để xử lý behavior, accessibility, focus, keyboard. |
| R8 - Không dùng Base UI trực tiếp | Product không tự xây UI bằng Base UI nếu component tương ứng đã có trong Company Registry. |
| R9 - Product sở hữu Source | Sau khi `add`, source nằm trong Product và Product có thể customize. |
| R10 - Dependency tự động | CLI phải tự kiểm tra/cài dependency cần thiết như `@base-ui/react`, icons. |
| R11 - Không overwrite | `update` không được tự động ghi đè component đã customize; phải `diff -> review -> apply`. |
| R12 - Version Tracking | Registry phải lưu version component để CLI có thể `check`, `diff`, `update`. |
| R13 - Product chủ động update | Registry release mới không tự động làm thay đổi Product. |
| R14 - CI kiểm tra chuẩn | Component trước khi đưa vào Registry phải qua lint, type-check, test, accessibility và visual test. |
| R15 - Registry là source of truth | Source chuẩn của UI component nằm trong `registry/company/ui`, không nằm trong runtime package `packages/ui`. |
| R16 - Không dùng `@company/ui` | Product không import UI component từ `@company/ui`; component mới phải dùng source local sau khi chạy CLI. |
| R17 - Xóa runtime UI package | Repo không duy trì `packages/ui` làm package public. Nếu cần migration legacy, tạo package compatibility riêng và có thời hạn deprecate rõ ràng. |
| R18 - Component mới vào registry trước | Mọi UI component mới phải được thêm vào registry, có metadata shadcn-compatible, Storybook registry page và rule sử dụng. |
| R19 - Pattern không phụ thuộc runtime UI | Pattern không phụ thuộc `@company/ui`; pattern dùng composition hoặc registry dependency để Product cài đủ source cần thiết. |

## Product usage rule

Product cài token package:

```bash
pnpm add @company/tokens
```

Product add component source:

```bash
company-ui add button
company-ui add dialog
```

Sau khi add, component nằm trong Product source:

```txt
src/components/ui/button.tsx
src/components/ui/dialog.tsx
```

Product import local component:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
```

Không dùng runtime package:

```tsx
// Avoid
import { Button } from "@company/ui";
```

## Registry source structure

Company UI Registry nên dùng schema chính thức của shadcn để tránh tự tạo format riêng.

Root registry:

```txt
registry.json
```

Ví dụ:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "company",
  "homepage": "https://design.company.local",
  "include": ["registry/company/ui/registry.json"]
}
```

UI registry:

```txt
registry/
  components/
    ui/
      registry.json
      button/
        button.tsx
      dialog/
        dialog.tsx
```

Mỗi component là một item `registry:ui`:

```json
{
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "Displays a button or button-like control.",
  "files": [
    {
      "path": "button/button.tsx",
      "type": "registry:ui",
      "target": "@ui/button.tsx"
    }
  ]
}
```

Component dùng Base UI cần khai báo:

```json
{
  "name": "dialog",
  "type": "registry:ui",
  "title": "Dialog",
  "description": "Accessible modal dialog built on Base UI.",
  "dependencies": ["@base-ui/react"],
  "registryDependencies": ["button"],
  "files": [
    {
      "path": "dialog/dialog.tsx",
      "type": "registry:ui",
      "target": "@ui/dialog.tsx"
    }
  ]
}
```

Rule:

- Dùng `$schema: "https://ui.shadcn.com/schema/registry.json"` cho registry root.
- Dùng `type: "registry:ui"` cho UI component.
- Dùng `dependencies` cho npm packages như `@base-ui/react`, `lucide-react`, `class-variance-authority`.
- Dùng `registryDependencies` cho component registry khác như `button`, `input`, `form-field`.
- Dùng `files[].target` với placeholder `@ui/`, `@components/`, `@lib/`, `@hooks/` để CLI resolve theo `components.json` của Product.
- Không tự tạo field riêng như `baseUi`, `tokens`, `version` trong item nếu muốn tương thích shadcn schema strict.

## CLI command rule

Nếu dùng shadcn schema, có hai lựa chọn.

### Option A - Dùng shadcn CLI trực tiếp

Product cấu hình registry trong `components.json`:

```json
{
  "registries": {
    "@company": "https://design.company.local/r/{name}.json"
  }
}
```

Sau đó add component:

```bash
pnpm dlx shadcn@latest add @company/button
```

### Option B - Company CLI wrapper

`company-ui` chỉ là wrapper quanh shadcn flow:

```bash
company-ui add button
company-ui add dialog
company-ui check
company-ui diff button
company-ui update button
company-ui list
```

Wrapper sẽ map:

```bash
company-ui add button
```

thành:

```bash
shadcn add @company/button
```

Lợi ích:

- Giữ command theo brand nội bộ.
- Enforce registry URL mặc định.
- Thêm check governance riêng.
- Kiểm tra token package `@company/tokens`.

### `add`

`add` phải:

- Đọc registry metadata.
- Copy source component vào Product.
- Cài npm dependencies trong `dependencies`.
- Cài registry dependencies trong `registryDependencies`.
- Respect `files[].target`.
- Không overwrite file đã tồn tại nếu chưa confirm.
- Ghi registry state vào Product.

### `check`

`check` phải:

- So sánh component local với registry version.
- Báo component outdated.
- Báo dependency thiếu.

### `diff`

`diff` phải:

- Hiển thị khác biệt giữa Product source và registry source.
- Không tự apply thay đổi.

### `update`

`update` phải:

- Chạy qua bước diff.
- Yêu cầu review.
- Chỉ apply khi được confirm.
- Không phá customize local một cách âm thầm.

## Product registry state

Sau khi add component, Product nên có file tracking:

```txt
company-ui.json
```

Ví dụ:

```json
{
  "registry": "https://registry.company.local/ui",
  "components": {
    "button": {
      "version": "0.1.0",
      "files": ["src/components/ui/button.tsx"]
    },
    "dialog": {
      "version": "0.1.0",
      "files": ["src/components/ui/dialog.tsx"]
    }
  }
}
```

## Base UI rule trong Registry Model

Base UI được dùng trong registry component để tăng tốc behavior/accessibility.

Allowed trong registry source:

```tsx
import { Dialog } from "@base-ui/react/dialog";
```

Avoid trong Product custom code nếu registry đã có component tương ứng:

```tsx
import { Dialog } from "@base-ui/react/dialog";
```

Lý do:

- Registry đảm bảo accessibility và API thống nhất.
- Product vẫn sở hữu source sau khi add.
- Product customize trên source đã chuẩn hóa, không tự build lại từ primitive.

## Khác biệt với runtime package model

### Runtime package model

Product dùng:

```tsx
import { Button } from "@company/ui";
```

Ưu điểm:

- Update tập trung.
- Product ít source hơn.
- Dễ enforce consistency.

Nhược điểm:

- Customize khó hơn.
- Product phụ thuộc runtime package API.

### Registry model

Product dùng:

```tsx
import { Button } from "@/components/ui/button";
```

Ưu điểm:

- Product sở hữu source.
- Customize linh hoạt.
- Không bị runtime package lock.

Nhược điểm:

- Cần CLI, registry metadata, diff/update flow.
- Governance khó hơn.
- Dễ drift giữa product nếu không tracking version.

## Decision rule

Chọn Registry Model nếu:

- Team muốn tốc độ và khả năng customize giống shadcn.
- Product có nhu cầu chỉnh source nhiều.
- Team chấp nhận đầu tư CLI và update governance.

Chọn Runtime Package Model nếu:

- Team ưu tiên consistency mạnh.
- Product ít customize.
- Muốn update tập trung qua package version.

Có thể dùng hybrid:

- `@company/tokens` là shared package.
- Registry copy UI source vào Product.
- Storybook vẫn là portal review/documentation.
- Không publish `@company/ui` như package runtime cho Product. Source chuẩn là `registry/company/ui`.

## Bước bổ sung khi dùng shadcn schema

So với kế hoạch tự build metadata riêng, cần thêm hoặc đổi các bước này:

1. Chọn dùng shadcn CLI trực tiếp hay `company-ui` wrapper.
2. Tạo root `registry.json` theo shadcn schema.
3. Dùng `include` để chia registry lớn thành nhiều file nhỏ.
4. Đổi metadata component sang `items[]` chuẩn shadcn.
5. Dùng `registryDependencies` thay cho dependency component tự định nghĩa.
6. Dùng `dependencies` và `devDependencies` cho npm package.
7. Dùng `files[].target` với `@ui/`, `@components/`, `@lib/`, `@hooks/`.
8. Tạo template `components.json` cho Product với `registries`.
9. Validate schema bằng JSON schema hoặc `shadcn/schema`.
10. Nếu cần `company-ui check/update`, vẫn cần tracking riêng như `company-ui.json` vì shadcn schema không thay thế governance nội bộ.

## Personal registry (sandbox)

`registry/personal` là bản copy local của `registry/company/ui` (kèm Storybook stories) để thử nghiệm và so sánh với company. Đây **không** phải nguồn chuẩn, không được release và bị `.gitignore`; chỉ `registry.personal.json` và `scripts/personal.mjs` được commit.

```bash
pnpm personal:sync          # copy company -> personal, KHÔNG ghi đè file đã có
pnpm personal:sync --force  # ghi đè toàn bộ personal từ company
pnpm personal:diff          # liệt kê file personal khác company (thêm --patch để xem diff)
pnpm personal:list          # liệt kê item của personal registry qua company-ui
pnpm typecheck:personal     # typecheck riêng ui + stories của personal
```

- Thêm component vào Product từ personal: `company-ui add button --cwd /path/to/product --registry "$PWD/registry.personal.json"`.
- Storybook hiển thị nhóm `Registry/Personal UI/*`; `@/lib/utils` trong `registry/personal` resolve về `registry/personal/ui/utils`, không phải company.
- Component mới của company được thêm vào personal khi chạy lại `personal:sync` (file personal đã sửa được giữ nguyên).
