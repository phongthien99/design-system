# Architecture Rules

## Monorepo target

```txt
design-system/
├── apps/
│   └── storybook/
├── packages/
│   ├── tokens/
│   ├── theme/
│   ├── primitives/
│   ├── patterns/
│   └── icons/
├── registry/
│   └── components/
│       └── ui/
└── tooling/
    └── company-ui/
```

## Package responsibility

### `packages/tokens`

Quản lý design token nguồn.

Bao gồm:

- Color token.
- Typography token.
- Spacing token.
- Radius token.
- Shadow token.
- Breakpoint token.
- Z-index token.

Không chứa React component.

### `packages/theme`

Quản lý theme runtime.

Bao gồm:

- CSS variables.
- Tailwind preset.
- Theme provider nếu cần.
- Light/dark theme.
- Brand theme.

Không chứa business component.

### `packages/primitives`

Wrapper nội bộ quanh Base UI hoặc Radix UI.

Bao gồm:

- Dialog primitive.
- Popover primitive.
- Select primitive.
- Tooltip primitive.
- Tabs primitive.

Rule quan trọng:

- Product không import package này.
- Registry component source được phép dùng package này.
- API primitive không được expose trực tiếp ra product.

### `registry/company/ui`

Source chuẩn cho UI component theo shadcn-style registry.

Bao gồm:

- Button.
- Input.
- Select.
- Dialog.
- Table.
- Form components.
- Base UI headless wrappers.

Rule:

- Đây là nguồn chính cho UI component.
- Product lấy component bằng `company-ui add <name>`.
- Product import component từ local source sau khi add.
- Không duy trì `packages/ui` làm runtime package public.
- Component phải dùng token/theme.
- Component không chứa business logic.

### `packages/patterns`

Public pattern package cho workflow dùng chung.

Bao gồm:

- SearchForm.
- FilterPanel.
- DataTable.
- ConfirmDialog.
- EmptyState.
- PageHeader.
- Toolbar.

Rule:

- Pattern không phụ thuộc `@company/ui`.
- Pattern dùng composition, hoặc khai báo registry dependency để Product add đủ UI source.
- Pattern không gọi API backend trực tiếp.
- Pattern nhận data/handler qua props.

### `packages/icons`

Quản lý icon dùng chung.

Rule:

- Icon phải có naming rõ ràng.
- Icon không encode màu cố định nếu không bắt buộc.
- Icon phải hỗ trợ `currentColor`.

### `apps/storybook`

Documentation portal.

Bao gồm:

- Component stories.
- Pattern stories.
- Usage guide.
- Do/don't.
- Accessibility notes.
- Migration notes.

## Dependency direction

Dependency chỉ được đi theo chiều:

```txt
tokens -> theme -> primitives -> registry -> product
tokens -> theme -> patterns -> product
```

Allowed:

- `theme` import `tokens`.
- `registry` component source import `theme`, `tokens`, `primitives` hoặc Base UI khi cần.
- `patterns` import `theme` hoặc nhận component qua props/composition.
- `storybook` import tất cả package để document.

Not allowed:

- `tokens` import `registry`.
- `registry` import `patterns`.
- `primitives` import `registry`.
- `product` import `primitives`.

## Public API rule

Mỗi package phải export qua entrypoint chính.

Ví dụ:

```ts
export { Button } from "./button";
export type { ButtonProps } from "./button";
```

Product không import deep path nếu chưa được public:

```ts
// Avoid
import { Button } from "@company/ui";

// Use after company-ui add button
import { Button } from "@/components/ui/button";
```

## Component folder convention

```txt
button/
├── button.tsx
├── button.test.tsx
├── button.stories.tsx
├── button.types.ts
└── index.ts
```

Nếu component đơn giản, có thể gom type trong file component. Nếu component phức tạp, tách type riêng.

## Naming convention

### Package

- `@company/tokens`
- `@company/theme`
- `@company/patterns`
- `@company/icons`
- `company-ui` CLI

### Component

- PascalCase cho component: `Button`, `DataTable`, `ConfirmDialog`.
- camelCase cho props: `isLoading`, `isDisabled`, `onOpenChange`.
- kebab-case cho file/folder: `confirm-dialog`, `data-table`.

## Styling rule

Component dùng Tailwind utility và token-backed CSS variables.

Allowed:

```tsx
className="bg-primary text-primary-foreground rounded-md"
```

Allowed nếu class map về CSS variable:

```css
--color-primary: var(--ds-color-primary-500);
```

Avoid:

```tsx
className="bg-[#1677ff] rounded-[6px]"
```

## Product integration rule

Product chỉ cần:

```bash
company-ui add button input dialog
```

```tsx
import "@company/theme/styles.css";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
```

Product không import `@company/ui`; UI source được copy có kiểm soát bằng CLI.
