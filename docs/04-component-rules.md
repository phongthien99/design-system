# Component Rules

## Mục tiêu

Component layer cung cấp UI public cho product. Component phải ổn định, accessible, dùng token và có documentation rõ ràng.

## Component checklist

Mỗi component cần có:

- API.
- Variant.
- Size.
- State.
- Accessibility.
- Story.
- Test.
- Usage docs.

## API rule

API phải đơn giản và nhất quán.

Common props:

```ts
type CommonComponentProps = {
  className?: string;
  children?: React.ReactNode;
};
```

Variant props:

```ts
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
```

State props:

```ts
type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
};
```

Rule:

- Dùng `variant` cho visual intent.
- Dùng `size` cho kích thước.
- Dùng `isLoading`, `isDisabled`, `isInvalid` khi state cần boolean rõ nghĩa.
- Event handler dùng format `onXChange`, `onClick`, `onOpenChange`.

## Variant rule

Variant phải có mục đích rõ ràng.

Button variant MVP:

```txt
primary
secondary
danger
ghost
```

Input variant MVP:

```txt
default
error
```

Badge variant MVP:

```txt
default
success
warning
danger
neutral
```

Không tạo variant chỉ vì một màn hình cần khác style nhỏ.

## Size rule

Size mặc định:

```txt
sm
md
lg
```

Rule:

- `md` là default.
- Size ảnh hưởng height, padding, font-size, icon-size.
- Không tạo size theo tên page hoặc product.

## State rule

Mỗi interactive component cần xử lý:

- Default.
- Hover.
- Focus visible.
- Active.
- Disabled.
- Loading nếu có action async.
- Error/invalid nếu là form control.

## Accessibility rule

Mỗi component phải đảm bảo:

- Keyboard interaction đúng kỳ vọng.
- Focus visible rõ ràng.
- Label hoặc aria-label cho control không có text.
- Disabled state không focus/click nếu disabled thật.
- Dialog trap focus và restore focus.
- Popover/Tooltip có behavior keyboard phù hợp.
- Form control expose invalid/error state đúng aria.

## Styling rule

Component dùng Tailwind class có mapping đến token.

Allowed:

```tsx
<button className="rounded-md bg-primary px-4 py-2 text-primary-foreground" />
```

Avoid:

```tsx
<button className="rounded-[6px] bg-[#1677ff] px-[13px]" />
```

## Composition rule

Component nên hỗ trợ composition khi có ích.

Ví dụ:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

Rule:

- Composition API dùng cho component phức tạp như Dialog, Select, Tabs.
- Component đơn giản như Button/Input không cần API phức tạp.

## ClassName rule

Component public nên nhận `className` để product có thể layout.

Rule:

- `className` được dùng cho layout adjustment.
- Product không dùng `className` để override core visual style trái guideline.
- Nếu nhiều product phải override cùng một kiểu, cần đưa thành variant hoặc token.

## Testing rule

Test tối thiểu:

- Render không lỗi.
- Disabled không trigger action.
- Loading hiển thị đúng.
- Keyboard interaction với component interactive.
- ARIA attribute quan trọng.

Không cần snapshot nặng cho mọi component nếu visual regression đã được Storybook xử lý.

## New component request rule

Trước khi tạo component mới, phải trả lời:

- Component này đã tồn tại chưa?
- Có thể dùng composition từ component hiện có không?
- Có ít nhất 2 product/workflow cần dùng không?
- API có đủ generic không?
- Design token hiện tại có đủ không?
- Có cần pattern thay vì component không?

