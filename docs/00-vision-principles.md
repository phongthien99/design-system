# Vision & Principles

## Tầm nhìn

Design System là nền tảng UI/UX dùng chung cho nhiều frontend project. Nó giúp product team build nhanh hơn, đồng nhất trải nghiệm người dùng, giảm duplication và giảm tranh luận style ở từng project.

Design System không phải thư viện component đơn lẻ. Nó là một contract giữa Design, BA, Dev và Product.

## Phạm vi quản lý

Design System quản lý:

- Design token: color, typography, spacing, radius, shadow, breakpoint, z-index.
- Theme: light/dark mode, brand theme, semantic CSS variables.
- Component dùng chung: Button, Input, Select, Dialog, Table...
- Pattern dùng chung: DataTable, SearchForm, FilterPanel, ConfirmDialog...
- Accessibility behavior: focus, keyboard, aria, overlay, portal.
- Documentation: Storybook, usage guide, do/don't, props, examples.
- Versioning và release note.

Design System không quản lý:

- Business logic riêng của product.
- API integration riêng của product.
- Page flow đặc thù từng domain nếu chưa được chuẩn hóa thành pattern.
- Custom one-off UI chỉ dùng một lần và không có khả năng tái sử dụng.

## Nguyên lý bắt buộc

### 1. Shared first

Nếu UI có khả năng dùng lại ở nhiều product, ưu tiên đưa vào Design System.

Product không được tự tạo lại `Button`, `Input`, `Modal`, `Table`, `Select`, `Checkbox` nếu Design System đã có component tương ứng.

### 2. Token first

Component không dùng hard-code style value như:

```css
color: #1677ff;
border-radius: 6px;
```

Component phải dùng token hoặc CSS variable:

```css
color: var(--color-primary);
border-radius: var(--radius-md);
```

### 3. Primitive is internal

Primitive layer dùng Base UI hoặc Radix UI để xử lý accessibility, keyboard, focus, portal, overlay.

Product không import trực tiếp primitive. Product dùng `company-ui add <component>` để đưa component chuẩn vào source local, rồi import từ `@/components/ui/*`.

### 4. API stable over clever

Component API phải dễ hiểu, ổn định và nhất quán giữa các component. Không tối ưu quá sớm bằng API phức tạp.

Ví dụ tốt:

```tsx
<Button variant="primary" size="md" isLoading>
  Save
</Button>
```

Ví dụ cần tránh:

```tsx
<Button intent="action-main" visualPreset="dense-brand-stateful" />
```

### 5. Accessibility is default

Accessibility không phải optional. Mọi component tương tác phải hỗ trợ keyboard, focus visible, aria đúng ngữ cảnh và state disabled/loading/error.

### 6. Documentation is part of done

Component chưa có Storybook, usage example, props và state thì chưa được coi là done.

### 7. Product owns source, registry owns standard

Product sở hữu source sau khi chạy CLI, nhưng source chuẩn vẫn nằm trong registry. Nếu customize cục bộ, Product phải theo dõi diff/update; nếu use case lặp lại, đóng góp ngược về registry.

### 8. Backward compatibility matters

Breaking change phải có migration guide và major version. Không đổi API hoặc visual behavior quan trọng một cách âm thầm.

## Definition of Done

Một component/pattern được coi là hoàn thành khi có:

- Public API rõ ràng.
- Variant, size và state cần thiết.
- Token usage đúng rule.
- Accessibility behavior.
- Storybook story.
- Usage docs.
- Test tối thiểu cho behavior quan trọng.
- Review từ Design và Dev.
- Changeset hoặc release note.
