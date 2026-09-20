# Product Adoption Rules

## Mục tiêu

Product team dùng Design System để build UI nhất quán, nhanh và dễ maintain.

## Import rule

Product lấy UI component bằng CLI:

```bash
company-ui add button
company-ui add input
company-ui add dialog
```

Sau đó import từ source local:

```tsx
import "@company/theme/styles.css";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
```

Không import từ runtime package hoặc primitive:

```tsx
// Avoid
import { Button } from "@company/ui";
import { DialogRoot } from "@company/primitives";
import { Dialog } from "@base-ui/react/dialog";
```

## No duplicate rule

Product không tự tạo lại component đã có:

- Button.
- Input.
- Select.
- Checkbox.
- Radio.
- Switch.
- Dialog/Modal.
- Tooltip.
- Popover.
- Tabs.
- Table.
- Pagination.

Nếu Design System component thiếu use case, tạo request thay vì copy/paste component mới trong product.

## Styling override rule

Product được dùng `className` cho layout:

```tsx
<Button className="w-full" />
```

Product không dùng `className` để phá visual contract:

```tsx
// Avoid
<Button className="bg-[#ff00cc] rounded-[3px]" />
```

Nếu cần visual khác lặp lại nhiều lần, request variant hoặc token mới.

## BA handoff rule

BA mô tả behavior và wireframe:

- Field nào required.
- Validation message.
- Loading/empty/error state.
- Action chính/phụ.
- Permission behavior.

BA không cần chỉ định:

- Màu button.
- Radius input.
- Shadow modal.
- Font size table.

Những phần đó lấy từ Design System.

## Product PR review rule

PR product cần bị review nếu:

- Tạo component trùng Design System.
- Hard-code style cho UI shared.
- Import primitive trực tiếp.
- Copy source từ Design System.
- Tự tạo variant không thông qua token/component API.

## Adoption strategy

### New product

New product phải dùng Design System từ đầu.

Setup:

```tsx
import "@company/theme/styles.css";
```

Use:

```bash
company-ui add button input dialog
```

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
```

### Existing product

Existing product migrate theo thứ tự:

```txt
Button/Input
      ↓
Form controls
      ↓
Dialog/Popover/Tooltip
      ↓
Table/Pagination
      ↓
Patterns
```

Không cần rewrite toàn bộ một lần. Ưu tiên màn hình đang phát triển hoặc hay thay đổi.

## Product exception rule

Product được phép custom UI riêng khi:

- Component chỉ dùng một lần.
- UI phục vụ business domain rất đặc thù.
- Design System chưa support và deadline không cho phép chờ.
- Đã tạo issue follow-up để chuẩn hóa nếu use case lặp lại.

Exception cần ghi rõ trong PR:

- Vì sao không dùng Design System.
- Có issue request component/pattern chưa.
- Có kế hoạch migrate không.

## Adoption KPI

Theo dõi:

- Số product đã cài `@company/tokens` và `@company/theme`.
- Số product đã dùng `company-ui add`.
- Số component shared được dùng.
- Số duplicate component còn tồn tại.
- Số request component mới.
- Thời gian từ request đến release.
- Số breaking change theo quarter.
