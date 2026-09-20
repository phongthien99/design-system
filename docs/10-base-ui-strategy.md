# Base UI Strategy

## Mục tiêu

Dùng Base UI để tăng tốc phát triển component nhưng vẫn giữ Design System dễ mở rộng, dễ thay đổi và không bị khóa cứng vào một thư viện primitive.

Base UI nên được xem là accessibility/interaction engine, không phải public API của Design System.

## Nguyên tắc chính

### 1. Base UI là internal dependency

Product không import trực tiếp từ `@base-ui/react`.

Allowed:

```tsx
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
```

Avoid:

```tsx
import { Dialog } from "@base-ui/react/dialog";
```

Lý do:

- Product không bị phụ thuộc vào API của Base UI.
- Design System có thể đổi primitive implementation nếu cần.
- API public của công ty ổn định hơn.

### 2. Tạo primitive wrapper mỏng

`packages/primitives` wrap Base UI theo từng component family.

Ví dụ:

```txt
packages/primitives/
  dialog/
    dialog-primitive.tsx
    index.ts
  popover/
  select/
  tooltip/
```

Wrapper này xử lý:

- Import từ Base UI.
- Mapping prop cần chuẩn hóa.
- Portal behavior.
- Naming thống nhất.
- Internal escape hatch nếu cần.

Wrapper này không xử lý:

- Visual style chính.
- Product-specific logic.
- Business behavior.

### 3. Public component nằm trong registry

`registry/company/ui` chứa component source có style/token từ primitive wrapper hoặc Base UI trực tiếp.

Ví dụ:

```txt
@company/primitives/dialog
      ↓
registry/company/ui/dialog
      ↓
company-ui add dialog
      ↓
Product
```

Public component chịu trách nhiệm:

- Variant.
- Size.
- Token styling.
- Compound API.
- Storybook.
- Test.
- Usage guideline.

### 4. Không leak Base UI state ra API public

Không đặt public API dựa quá sát internal API của Base UI nếu không cần.

Good:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Confirm</DialogTitle>
  </DialogContent>
</Dialog>
```

Avoid:

```tsx
<BaseDialogRoot modal trapFocus unstable_internalFlag />
```

Rule:

- API public dùng ngôn ngữ của Design System.
- Internal API của Base UI chỉ được expose nếu thật sự cần và đã review.

### 5. Style bằng token, không style theo Base UI trực tiếp

Base UI cung cấp behavior và state hook. Design System quyết định style.

Allowed:

```tsx
<SelectTrigger className="border-border bg-background text-foreground" />
```

Allowed khi dùng data attribute để style state:

```tsx
<SelectItem className="data-[highlighted]:bg-accent data-[disabled]:opacity-50" />
```

Avoid:

```tsx
<SelectTrigger className="border-[#d9d9d9] bg-[#fff] text-[#111]" />
```

Rule:

- Dùng Tailwind class đã map về token.
- Dùng data attribute của Base UI để style state.
- Không dùng hard-code visual value.

### 6. Chuẩn hóa composition API

Base UI hỗ trợ composition qua `render` prop. Design System có thể expose API gần với `asChild` nếu team quen shadcn/Radix style, hoặc expose `render` nếu muốn bám Base UI hơn.

Khuyến nghị:

- Với public API, ưu tiên pattern nhất quán cho team.
- Nếu team đã quen shadcn, dùng `asChild` ở registry component public API.
- Bên trong wrapper có thể map sang `render` của Base UI.

Rule:

- Mọi custom trigger phải forward ref.
- Mọi custom trigger phải spread props xuống DOM node.
- Không tạo wrapper làm mất keyboard/focus props từ Base UI.

### 7. Portal và stacking context phải được chuẩn hóa

Tạo global setup trong theme:

```css
.app-root {
  isolation: isolate;
}
```

Và document rằng app root cần áp dụng class này nếu product dùng Dialog/Popover/Tooltip.

Rule:

- Z-index lấy từ token.
- Portal container behavior phải nhất quán.
- Dialog/Popover/Tooltip không tự hard-code stacking ngẫu nhiên.

### 8. Có adapter layer cho component phức tạp

Các component như Select, Combobox, Dialog, Popover, Tooltip nên có adapter nội bộ.

Ví dụ:

```txt
Base UI Select parts
      ↓
Primitive adapter
      ↓
Styled DS Select
      ↓
Product API
```

Adapter giúp:

- Giấu complexity của Base UI.
- Chuẩn hóa prop naming.
- Kiểm soát slot nào được public.
- Dễ thay đổi implementation sau này.

### 9. Mở rộng bằng slot, không mở rộng bằng copy source

Component phức tạp nên có slot API có kiểm soát.

Ví dụ:

```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Delete item</DialogTitle>
    <DialogDescription>This action cannot be undone.</DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="danger">Delete</Button>
  </DialogFooter>
</DialogContent>
```

Rule:

- Mở rộng bằng composition.
- Không fork component trong product.
- Nếu thiếu slot, request thêm slot vào Design System.

### 10. Test behavior ở wrapper và registry component

Test cần cover:

- Controlled/uncontrolled state.
- Keyboard navigation.
- Focus management.
- Disabled behavior.
- ARIA attribute quan trọng.
- Portal render.
- Close/open interactions.

Rule:

- `packages/primitives` test integration với Base UI nếu wrapper có logic.
- `registry/company/ui` test public behavior product dùng.

## Folder mẫu cho Dialog

```txt
packages/
  primitives/
    dialog/
      dialog-primitive.tsx
      index.ts
registry/
  components/
    ui/
      dialog/
        dialog.tsx
        dialog.stories.tsx
        dialog.test.tsx
```

## API mẫu

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>
            Please confirm before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Khi nào wrap mỏng, khi nào abstract mạnh

### Wrap mỏng

Dùng cho:

- Tooltip.
- Popover.
- Tabs.
- Dialog basic.

Lý do: API primitive đã gần với nhu cầu product.

### Abstract mạnh

Dùng cho:

- Select.
- Combobox.
- DataTable.
- FormField.

Lý do: Product cần API đơn giản hơn, ít slot hơn, behavior nhất quán hơn.

## Checklist trước khi expose component

- [ ] Product không cần import `@base-ui/react`.
- [ ] Public API dùng naming của Design System.
- [ ] Style dùng token.
- [ ] State style dùng data attribute hoặc state prop rõ ràng.
- [ ] Custom trigger/slot giữ ref và props.
- [ ] Có Storybook states.
- [ ] Có accessibility note.
- [ ] Có test behavior quan trọng.
- [ ] Không leak prop nội bộ nếu chưa cần.
