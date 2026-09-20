# Project Plan

## Mục tiêu project

Dựng một Design System có thể publish và dùng chung cho nhiều frontend project.

Target output:

- Monorepo chuẩn.
- Package tokens/theme/patterns/icons.
- Company UI Registry theo shadcn schema.
- `company-ui` CLI để add/check/update component source.
- Storybook portal.
- CI kiểm tra lint, typecheck, test, build.
- Versioning bằng Changesets.
- Governance để request, review và release component.

## Phase 0: Chuẩn bị quyết định kỹ thuật

### Việc cần chốt

- Package manager: `pnpm`.
- Build orchestration: `Turborepo`.
- UI framework: `React`.
- Language: `TypeScript`.
- Styling: `Tailwind CSS`.
- Primitive: `Base UI` hoặc `Radix UI`.
- Documentation: `Storybook`.
- Versioning: `Changesets`.
- Test: `Vitest`, `Testing Library`, `Playwright` hoặc Storybook test runner.

### Output

- Architecture decision record cho primitive layer.
- Naming convention cho package.
- Initial design token taxonomy.
- Danh sách MVP component.

## Phase 1: Foundation

### Mục tiêu

Tạo nền móng để component dùng token và theme thống nhất.

### Công việc

- Khởi tạo monorepo.
- Tạo `packages/tokens`.
- Tạo `packages/theme`.
- Tạo Tailwind preset dùng chung.
- Tạo CSS variables cho light theme.
- Tạo Storybook app.
- Tạo `registry/company/ui`.
- Tạo Button và Input đầu tiên trong registry để validate kiến trúc.
- Tạo `company-ui add` MVP.

### Component trong phase

- Button
- Input

### Output

- `@company/tokens`
- `@company/theme`
- `registry/company/ui/primitives/button`
- `registry/company/ui/components/input`
- `company-ui` CLI
- Storybook chạy được.
- Product demo add và import local được Button/Input.

## Phase 2: Core Components

### Mục tiêu

Hoàn thiện nhóm component cơ bản đủ cho form, dialog và table workflow.

### Công việc

- Xây form controls.
- Xây overlay components.
- Xây table cơ bản.
- Chuẩn hóa component API.
- Viết story và test cho từng component.

### Component trong phase

- Textarea
- Checkbox
- Radio
- Switch
- Select
- Tooltip
- Popover
- Dialog
- Tabs
- Badge
- Alert
- Table
- Pagination

### Output

- Core components có docs.
- Component checklist được áp dụng trong PR.
- Release version đầu tiên có thể dùng cho product thật.

## Phase 3: Patterns

### Mục tiêu

Chuẩn hóa workflow thường gặp để product không phải ghép component lặp lại.

### Pattern trong phase

- SearchForm
- FilterPanel
- DataTable
- ConfirmDialog
- EmptyState
- FormField
- PageHeader
- Toolbar
- PaginationTable

### Output

- `@company/patterns`.
- Storybook có examples theo workflow.
- Product có thể dùng pattern thay vì tự build lại layout phổ biến.

## Phase 4: Governance & Scale

### Mục tiêu

Đưa Design System vào vận hành thật với versioning, CI, review process và adoption rule.

### Công việc

- Setup Changesets.
- Setup release workflow.
- Setup visual regression test nếu cần.
- Setup request process cho component mới.
- Setup adoption guideline cho product.
- Tạo migration guide khi có breaking change.

### Output

- Release process rõ ràng.
- Contribution guide rõ ràng.
- Product adoption rule rõ ràng.
- Dashboard hoặc checklist adoption theo product.

## Timeline gợi ý

### Sprint 1

- Monorepo.
- Tokens.
- Theme.
- Storybook.
- Button.
- Input.

### Sprint 2

- FormField.
- Checkbox.
- Select.
- Dialog.
- Alert.
- Badge.

### Sprint 3

- Table.
- Pagination.
- Tooltip.
- Popover.
- Tabs.
- Storybook docs chuẩn.

### Sprint 4

- DataTable.
- SearchForm.
- FilterPanel.
- ConfirmDialog.
- Release workflow.
- Product pilot.

## Rủi ro chính

### Scope creep

Team cố đưa mọi thứ vào Design System quá sớm.

Rule: chỉ đưa vào Design System khi có khả năng dùng lại hoặc có giá trị chuẩn hóa.

### Component API không nhất quán

Mỗi component tự đặt prop khác nhau.

Rule: dùng naming convention chung cho `variant`, `size`, `disabled`, `loading`, `error`, `required`.

### Product bypass Design System

Product tự build component vì nhanh hơn trong ngắn hạn.

Rule: PR product bị reject nếu tự tạo lại component đã tồn tại trong Design System mà không có lý do được approve.

### Token bị phá vỡ

Dev dùng trực tiếp hex/radius/spacing ngoài token.

Rule: lint hoặc review phải chặn hard-code value trong component shared.
