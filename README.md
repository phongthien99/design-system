# Design System

Design System dùng chung cho nhiều frontend project theo hướng:

- React
- TypeScript
- Tailwind CSS
- Base UI hoặc Radix UI cho primitive layer
- shadcn-style source ownership cho component layer
- Storybook làm documentation portal
- pnpm workspace + Turborepo + Changesets

## Mục tiêu

Design System này quản lý UI/UX dùng chung, design token, component, pattern và rule áp dụng giữa BA, Design, Dev và Product team.

Product không tự tạo lại UI primitive hoặc component đã có trong Design System. Product lấy UI component bằng `company-ui add ...`, sau đó import từ source local của Product. Shared package còn lại là `@company/tokens`, `@company/theme`, `@company/icons` và các package hỗ trợ khác nếu cần.

## Docs chính

- [Vision & Principles](docs/00-vision-principles.md)
- [Project Plan](docs/01-project-plan.md)
- [Architecture Rules](docs/02-architecture-rules.md)
- [Design Token Rules](docs/03-design-token-rules.md)
- [Component Rules](docs/04-component-rules.md)
- [Storybook Rules](docs/05-storybook-rules.md)
- [Governance & Release](docs/06-governance-release.md)
- [Product Adoption Rules](docs/07-product-adoption-rules.md)
- [MVP Checklist](docs/08-mvp-checklist.md)
- [Implementation Blueprint](docs/09-implementation-blueprint.md)
- [Base UI Strategy](docs/10-base-ui-strategy.md)
- [Registry Model Rules](docs/11-registry-model-rules.md)
- [Registry Implementation Audit](docs/12-registry-implementation-audit.md)
- [Component Taxonomy Levels](docs/13-component-taxonomy-levels.md)

## Kiến trúc mục tiêu

```txt
Token
  ↓
Theme
  ↓
Primitive
  ↓
Component
  ↓
Pattern
  ↓
Product
```

## Package mục tiêu

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

## MVP đầu tiên

MVP chỉ cần đủ để các product bắt đầu dùng chung UI:

- Tokens
- Theme
- Button
- Input
- Select
- Checkbox
- Dialog
- Table
- Form
- Pagination
- Storybook documentation

### Tiến độ hiện tại (2026-09-20)

- Đã có: monorepo, tokens, theme, Storybook, registry 41 component, CLI `company-ui`, 6/8 component MVP (Button, Input, Select, Checkbox, Dialog, Form).
- Chưa có: Table, Pagination, test, workflow CI, product pilot.
- `pnpm build`, `pnpm typecheck`, `pnpm lint` và `pnpm format:check` đều pass (`pnpm lint:fix` / `pnpm format` để tự sửa).

Chi tiết xem [MVP Checklist](docs/08-mvp-checklist.md) và [Registry Implementation Audit](docs/12-registry-implementation-audit.md).

## Rule ngắn gọn

- Token là nguồn sự thật cho visual foundation.
- Primitive layer là nội bộ, product không import trực tiếp.
- Base UI chỉ nằm sau wrapper của Design System, không lộ trực tiếp ra product.
- Product dùng `company-ui add <component>` để copy source component vào codebase.
- Product import UI từ local source như `@/components/ui/button`.
- Không publish hoặc consume `@company/ui` làm runtime package cho component mới.
- Component chưa có Storybook, accessibility note và test thì chưa được release.
- Breaking change phải có migration guide và major version.

## Registry model

Nếu team chọn hướng registry giống shadcn, component sẽ được quản lý tập trung trong Company UI Registry và được copy source vào Product bằng CLI:

```bash
company-ui add button
```

Khi dùng model này, `@company/tokens` vẫn là shared package bắt buộc, còn UI component source thuộc về Product sau khi được add. Xem chi tiết tại [Registry Model Rules](docs/11-registry-model-rules.md).

CLI MVP hiện có:

```bash
pnpm build
pnpm company-ui list
pnpm company-ui add button --cwd /path/to/product --registry "$PWD/registry.json"
pnpm company-ui check --cwd /path/to/product --registry "$PWD/registry.json"
```

`--registry` bắt buộc khi product nằm ngoài repo này, vì CLI tìm `registry.json` ngược lên từ `--cwd`. `add` hiện chỉ nhận một component mỗi lệnh.

Registry source hiện nằm tại:

```txt
registry.json
registry/company/ui/registry.json
registry/company/ui/primitives/*/*.tsx
registry/company/ui/components/*/*.tsx
registry/company/ui/composites/*/*.tsx
```

Muốn thử nghiệm mà không đụng vào source chuẩn: `pnpm personal:sync` tạo bản sandbox `registry/personal` (xem [Registry Model Rules](docs/11-registry-model-rules.md#personal-registry-sandbox)).

Registry hiện cover toàn bộ public Base UI component exports từ `@base-ui/react@1.8.0`, gồm các item như `accordion`, `autocomplete`, `combobox`, `menu`, `popover`, `select`, `tabs`, `toast`, `tooltip` và các component khác. 10 item đã style sẵn (`button`, `input`, `checkbox`, `dialog`, `form-field`, `select`, `switch`, `tabs`, `tooltip`, `popover`); 31 item còn lại là headless wrappers để Product add source và style dần.
