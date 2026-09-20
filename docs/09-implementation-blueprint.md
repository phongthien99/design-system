# Implementation Blueprint

## Mục tiêu

File này mô tả thứ tự dựng project thực tế từ repo trống đến MVP Design System có thể publish và dùng thử trong product.

## Step 1: Khởi tạo workspace

Tạo cấu trúc:

```txt
apps/
  storybook/
packages/
  tokens/
  theme/
  primitives/
  ui/
  patterns/
  icons/
tooling/
```

Root files cần có:

```txt
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
.changeset/
README.md
docs/
```

## Step 2: Root package scripts

Root `package.json` nên có scripts:

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "storybook": "pnpm --filter @company/storybook storybook",
    "build:storybook": "pnpm --filter @company/storybook build-storybook",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "turbo build && changeset publish"
  }
}
```

Rule:

- Script root chỉ orchestrate.
- Build logic riêng nằm trong từng package.
- CI gọi root scripts.

## Step 3: Workspace config

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

Rule:

- Không đặt product app thật trong repo này.
- Storybook là app duy nhất bắt buộc trong monorepo Design System.

## Step 4: Turbo pipeline

`turbo.json` target:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "storybook-static/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {},
    "test": {}
  }
}
```

Rule:

- Package phụ thuộc phải build trước package tiêu thụ.
- Storybook build là một phần của release validation.

## Step 5: Package dependency map

```txt
@company/tokens
  ↓
@company/theme
  ↓
@company/primitives
  ↓
registry/company/ui
  ↓
Product source
```

Dependency rule:

```txt
theme depends on tokens
primitives depends on theme
registry components depend on theme + primitives/Base UI
patterns depend on composition or registry dependencies
storybook depends on all packages
```

Không cho dependency ngược.

## Step 6: Tokens package

`@company/tokens` output nên có:

```txt
dist/
  index.js
  index.d.ts
  tokens.css
```

Export:

```ts
export const colors = {};
export const spacing = {};
export const radius = {};
export const typography = {};
```

Rule:

- Token source có thể là TypeScript object hoặc JSON.
- CSS variables được generate từ token source.
- Không để component tự định nghĩa token riêng.

## Step 7: Theme package

`@company/theme` output nên có:

```txt
dist/
  styles.css
  tailwind-preset.js
  index.js
  index.d.ts
```

Export:

```ts
export { ThemeProvider } from "./theme-provider";
```

Rule:

- Product import CSS một lần ở app root.
- Tailwind preset là nguồn mapping token vào utility class.
- Theme package không chứa component business.

## Step 8: Primitives package

`@company/primitives` wrap Base UI hoặc Radix UI.

Rule:

- Package này là internal.
- Product không import.
- Registry component source dùng primitives hoặc Base UI trực tiếp để build component public.
- Primitive wrapper giúp đổi thư viện nền dễ hơn nếu cần.

## Step 9: UI registry

`registry/company/ui` là source of truth cho UI component. Product dùng CLI để copy source vào codebase, không import runtime package `@company/ui`.

MVP registry items:

```txt
button
input
select
checkbox
dialog
table
form-field
pagination
```

Rule:

- Mỗi component là một `registry:ui` item.
- `files[].target` phải dùng `@ui/` để CLI copy đúng chỗ trong Product.
- Khai báo `dependencies` và `registryDependencies` đầy đủ.
- Component dùng token/theme.
- Storybook và test đi cùng component.

## Step 10: Patterns package

`@company/patterns` build workflow dùng composition hoặc khai báo registry dependencies. Package này không phụ thuộc `@company/ui`.

MVP patterns:

```txt
SearchForm
FilterPanel
DataTable
ConfirmDialog
EmptyState
PageHeader
Toolbar
PaginationTable
```

Rule:

- Pattern không gọi API backend.
- Pattern nhận data, columns, loading, error, handler qua props.
- Pattern không chứa business permission riêng của product.

## Step 11: Storybook setup

Storybook cần load theme global:

```ts
import "@company/theme/styles.css";
```

Docs organization:

```txt
Foundation/
  Tokens
  Colors
  Typography
Components/
  Button
  Input
  Dialog
Patterns/
  DataTable
  SearchForm
Governance/
  Contribution
  Release
```

Rule:

- Storybook là contract documentation.
- Mọi component public phải có story.
- Story phải cover state quan trọng.

## Step 12: CI validation

CI tối thiểu:

```txt
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build:storybook
```

Optional:

```txt
visual regression
a11y test
bundle size check
```

Rule:

- Không release nếu build hoặc typecheck fail.
- Không merge component mới nếu thiếu story.

## Step 13: First release

Release MVP package:

```txt
@company/tokens
@company/theme
@company/icons
company-ui CLI
company registry
```

Nếu patterns chưa ổn định, giữ private hoặc alpha:

```txt
@company/patterns@0.x
```

Rule:

- Release nhỏ nhưng dùng được thật.
- Ưu tiên ổn định Button/Input/Dialog/Table hơn là nhiều component nửa vời.

## Step 14: Product pilot

Chọn một product pilot và migrate:

```txt
Button
Input
Dialog
Table
Pagination
```

Ghi nhận:

- API nào khó dùng.
- Variant nào thiếu.
- Token nào thiếu.
- Pattern nào lặp lại.

Sau pilot, chỉnh API trước khi rollout nhiều product.
