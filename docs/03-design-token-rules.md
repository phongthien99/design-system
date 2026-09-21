# Design Token Rules

## Mục tiêu

Token là nguồn sự thật cho visual foundation. Component không được tự quyết định màu, spacing, radius, shadow nếu giá trị đó đã thuộc hệ thống.

## Token groups

### Color

Nhóm token:

```txt
color.primary.50
color.primary.100
color.primary.500
color.primary.600
color.neutral.50
color.neutral.900
color.success.500
color.warning.500
color.danger.500
```

Semantic token:

```txt
color.background.default
color.background.subtle
color.text.primary
color.text.secondary
color.text.disabled
color.border.default
color.border.strong
color.action.primary
color.action.primaryHover
color.feedback.success
color.feedback.warning
color.feedback.danger
```

Rule:

- Component ưu tiên dùng semantic token.
- Primitive palette token chỉ dùng trong theme mapping.

### Typography

```txt
font.family.sans
font.size.xs
font.size.sm
font.size.md
font.size.lg
font.weight.regular
font.weight.medium
font.weight.semibold
lineHeight.tight
lineHeight.normal
```

Rule:

- Không dùng font-size arbitrary trong shared component.
- Heading scale phải có token.

### Spacing

```txt
spacing.0
spacing.1
spacing.2
spacing.3
spacing.4
spacing.6
spacing.8
spacing.10
spacing.12
```

Rule:

- Spacing trong component phải lấy từ Tailwind preset hoặc CSS variable.
- Không dùng magic number cho padding/gap/margin.

### Radius

```txt
radius.none
radius.sm
radius.md
radius.lg
radius.full
```

Rule:

- Button/Input/Dialog/Table phải dùng radius token.
- Không tự dùng `rounded-[7px]` trong shared component.

### Shadow

```txt
shadow.none
shadow.sm
shadow.md
shadow.lg
shadow.overlay
```

Rule:

- Overlay, popover, dialog dùng semantic shadow.
- Không dùng shadow tùy ý cho từng component.

### Breakpoint

```txt
breakpoint.sm
breakpoint.md
breakpoint.lg
breakpoint.xl
```

Rule:

- Breakpoint phải đồng bộ với Tailwind config.
- Product không tự định nghĩa breakpoint khác nếu đang dùng Design System.

### Z-index

```txt
zIndex.base
zIndex.dropdown
zIndex.sticky
zIndex.overlay
zIndex.modal
zIndex.toast
```

Rule:

- Overlay component không hard-code z-index.
- Modal phải cao hơn popover/dropdown.

## Token naming rule

Token name phải:

- Có cấp bậc rõ ràng.
- Không gắn với một component cụ thể nếu có thể dùng rộng hơn.
- Dùng semantic name cho usage.
- Dùng scale name cho raw palette.

Good:

```txt
color.text.primary
color.action.primary
radius.md
spacing.4
```

Avoid:

```txt
buttonBlue
inputBorderGrey
mainColor
cardRadius
```

## CSS variable rule

Theme output nên expose CSS variables:

```css
:root {
  --color-background: #ffffff;
  --color-foreground: #111827;
  --color-primary: #1677ff;
  --radius-md: 0.375rem;
}
```

Component dùng:

```css
background: var(--color-primary);
border-radius: var(--radius-md);
```

## Hard-code rule

Không được hard-code trong shared component:

- Hex color.
- RGB/HSL literal.
- Arbitrary radius.
- Arbitrary spacing.
- Arbitrary shadow.
- Arbitrary z-index.

Ngoại lệ phải có comment giải thích hoặc issue link.

Rule được chặn bằng `ds/no-hardcoded-token` (chạy trong `pnpm lint`). Ngoại lệ dùng `// eslint-disable-next-line ds/no-hardcoded-token -- <lý do hoặc issue link>`.

## Token change rule

Thay đổi token có thể ảnh hưởng toàn bộ product. Vì vậy:

- Token mới: minor change.
- Token rename/remove: breaking change.
- Token value đổi mạnh về visual: cần review với Design.
- Token semantic đổi ý nghĩa: breaking change.

