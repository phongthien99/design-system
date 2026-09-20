# Component Taxonomy Levels

Tài liệu này hướng dẫn cách tổ chức, đặt tên, review và release component theo 5 cấp:

```txt
L1 Primitive -> L2 Component -> L3 Composite -> L4 Pattern -> L5 Template
```

Mục tiêu là giúp BA, Design, Dev và Product nói cùng một ngôn ngữ khi yêu cầu UI mới, tránh tạo trùng component, và giữ Design System không bị lẫn business logic.

## Lưu ý về chữ Primitive

Trong tài liệu này, **L1 Primitive** nghĩa là UI element nhỏ nhất theo taxonomy sản phẩm.

Trong codebase hiện tại, `packages/primitives` lại có nghĩa khác: wrapper nội bộ quanh Base UI/Radix UI. Product không import trực tiếp package đó.

Vì vậy khi trao đổi, nên nói rõ:

- **L1 Primitive UI**: Button, Icon, Badge, Text, Divider, Avatar.
- **Headless primitive/internal primitive**: Dialog primitive, Select primitive, Popover primitive trong `packages/primitives` hoặc Base UI.

## Tổng quan 5 cấp

| Cấp | Ý nghĩa | Ví dụ | Nơi quản lý chính |
| --- | --- | --- | --- |
| **L1 Primitive** | Thành phần UI nhỏ nhất, thường không tự giải quyết một workflow | Button, Icon, Badge, Text, Divider, Avatar | `registry/company/ui/primitives`, `packages/icons` |
| **L2 Component** | Thành phần UI hoàn chỉnh, có API và state rõ ràng | Input, Select, Checkbox, DatePicker, Tabs | `registry/company/ui/components` |
| **L3 Composite** | Ghép nhiều L1/L2 thành một khối UI tái sử dụng | SearchBox, FormField, Pagination, FileUpload | `registry/company/ui/composites` hoặc `packages/patterns` nếu workflow dùng rộng |
| **L4 Pattern** | Giải quyết một UX problem lặp lại giữa nhiều product | SearchPanel, LoginForm, FilterPanel, DataTable | `packages/patterns/src/patterns` |
| **L5 Template** | Khung màn hình, chưa chứa business cụ thể | ListPage, DetailPage, FormPage, DashboardLayout | `packages/patterns/src/templates` hoặc product app |

## Nguyên tắc phân cấp nhanh

Khi có yêu cầu UI mới, đi từ câu hỏi nhỏ nhất:

1. UI này có phải một element nhỏ, dùng độc lập và không biết gì về workflow không?
   - Có: **L1 Primitive**.
2. UI này là một control hoàn chỉnh, có state, accessibility và interaction riêng không?
   - Có: **L2 Component**.
3. UI này ghép nhiều control thành một khối nhỏ có API tiện hơn không?
   - Có: **L3 Composite**.
4. UI này giải quyết một vấn đề UX đầy đủ như search, filter, form login, table interaction không?
   - Có: **L4 Pattern**.
5. UI này là layout cho cả màn hình/page, chỉ chờ product truyền data và business content vào không?
   - Có: **L5 Template**.

Nếu component gọi API backend, biết route, biết permission, biết business entity cụ thể như `Customer`, `Order`, `Invoice`, thì nó không còn là Design System component. Nó thuộc product.

## L1 Primitive

L1 là những mảnh UI nhỏ nhất, dùng để xây các cấp cao hơn.

Ví dụ:

- `Button`
- `Icon`
- `Badge`
- `Text`
- `Divider` hoặc `Separator`
- `Avatar`
- `Progress`
- `Meter`

Quy tắc:

- Không chứa business logic.
- Không gọi API.
- Không biết form schema, route hoặc entity.
- Có variant/size/state rõ ràng nếu cần.
- Dùng token/theme, không hard-code màu và spacing tùy tiện.

Vị trí:

- UI source: `registry/company/ui/primitives/<name>/<name>.tsx`.
- Icon dùng chung: `packages/icons`.
- Story: `registry/stories/generated/<name>.stories.tsx` hoặc story thủ công nếu cần.

Ví dụ hiện có:

- `button`
- `avatar`
- `separator`
- `progress`
- `meter`

## L2 Component

L2 là control hoàn chỉnh, thường có interaction, accessibility và state riêng.

Ví dụ:

- `Input`
- `Select`
- `Checkbox`
- `RadioGroup`
- `Switch`
- `Tabs`
- `Dialog`
- `Popover`
- `Tooltip`
- `DatePicker`

Quy tắc:

- API public phải ổn định và dễ dùng.
- Có state cơ bản: default, hover, focus, disabled, invalid/loading nếu phù hợp.
- Có keyboard interaction đúng kỳ vọng.
- Không encode workflow cụ thể.
- Không phụ thuộc vào L4 Pattern hoặc L5 Template.

Vị trí:

- Chủ yếu nằm trong `registry/company/ui/components`.
- Được product copy bằng `company-ui add <component>`.
- Có thể dùng Base UI hoặc `packages/primitives` phía sau, nhưng product không thấy dependency nội bộ đó như API chính.

Ví dụ hiện có:

- `input`
- `checkbox`
- `select`
- `tabs`
- `dialog`
- `popover`
- `tooltip`
- `switch`

## L3 Composite

L3 ghép nhiều L1/L2 thành một khối nhỏ để giảm lặp code ở product.

Ví dụ:

- `SearchBox`
- `FormField`
- `Pagination`
- `FileUpload`
- `PasswordField`
- `DateRangePicker`

Quy tắc:

- Có thể chứa layout nhỏ bên trong.
- Có thể gom label, helper text, error message, icon, action button.
- Không tự gọi API.
- Không tự quyết định business validation.
- API vẫn phải generic.

Vị trí:

- Nếu là UI composite thấp và có thể copy vào product: `registry/company/ui/composites`.
- Nếu là workflow mini dùng chung nhiều nơi: cân nhắc `packages/patterns`.

Ví dụ hiện có:

- `form-field`
- `checkbox-group`
- `toggle-group`
- `otp-field`
- `autocomplete`
- `combobox`

## L4 Pattern

L4 giải quyết một UX problem có tính lặp lại giữa nhiều product.

Ví dụ:

- `SearchPanel`
- `LoginForm`
- `FilterPanel`
- `DataTable`
- `ConfirmDialog`
- `EmptyState`
- `PageHeader`
- `Toolbar`

Quy tắc:

- Nhận data và handler qua props.
- Không gọi API backend trực tiếp.
- Không biết route cụ thể của product.
- Không import `@company/ui` runtime package.
- Có thể khai báo registry dependency để product add đủ source UI.
- Có thể nhận component qua composition hoặc render props khi cần linh hoạt.

Vị trí:

- `packages/patterns/src/patterns/<pattern-name>`.
- Story nằm cạnh pattern hoặc trong Storybook.

Ví dụ hiện có:

- `packages/patterns/src/patterns/empty-state`.

## L5 Template

L5 là khung màn hình, chưa chứa business cụ thể. Template giúp product tạo page nhanh và nhất quán.

Ví dụ:

- `ListPage`
- `DetailPage`
- `FormPage`
- `DashboardLayout`
- `SettingsLayout`
- `AuthLayout`

Quy tắc:

- Chỉ định cấu trúc màn hình: header, toolbar, content, sidebar, empty/loading/error slot.
- Không chứa query API cụ thể.
- Không biết business entity cụ thể.
- Nên dùng slot/composition để product truyền nội dung.
- Không biến thành page thật của product.

Vị trí:

- Nếu template dùng chung rộng: `packages/patterns/src/templates/<template-name>`.
- Nếu chỉ là scaffold cho một app: đặt trong product app, không đưa vào Design System.

## Mapping với kiến trúc repo

```txt
packages/tokens
  -> foundation, không phải component level

packages/theme
  -> theme runtime, không phải component level

packages/icons
  -> L1 Primitive cho icon

registry/company/ui
  -> primitives, components, composites, utils

packages/primitives
  -> internal/headless primitive wrapper, không map trực tiếp với L1 taxonomy

packages/patterns
  -> patterns, templates nếu dùng chung rộng

apps/storybook
  -> documentation cho toàn bộ level
```

## Dependency direction

Dependency chỉ được đi từ cấp thấp lên cấp cao:

```txt
L1 -> L2 -> L3 -> L4 -> L5 -> Product
```

Allowed:

- L2 dùng L1.
- L3 dùng L1 và L2.
- L4 dùng L1/L2/L3 qua composition hoặc registry dependency.
- L5 dùng L4 và các slot/component bên dưới.

Not allowed:

- L1 import L2/L3/L4/L5.
- L2 import Pattern hoặc Template.
- Registry UI import `packages/patterns`.
- Pattern gọi API backend trực tiếp.
- Template chứa business entity cụ thể.

## Lifecycle status

Mỗi registry item nên có `status` để team biết component đang thử nghiệm hay đã sẵn sàng dùng rộng:

```json
{
  "name": "button",
  "type": "registry:ui",
  "status": "public"
}
```

Status hiện dùng:

| Status | Ý nghĩa | Khi nào dùng |
| --- | --- | --- |
| `draft` | Đang thử nghiệm, chưa khuyến nghị product dùng rộng | Headless wrapper, component thiếu style/API/test/a11y note |
| `public` | Sẵn sàng cho product adoption | API ổn định, style theo token, có Storybook, đã review accessibility cơ bản |
| `deprecated` | Không khuyến nghị dùng mới | Có component thay thế hoặc chuẩn bị migration |

Rule:

- Component mới mặc định là `draft`.
- Chỉ đổi sang `public` sau khi review API, state, token usage, Storybook và accessibility.
- Nếu item `public` bị thay API breaking, cần migration note trước khi release.
- Storybook và `company-ui list` phải hiển thị status để product nhìn thấy ngay.

## Quy trình khi thêm UI mới

1. Kiểm tra component/pattern đã tồn tại chưa.
2. Xác định level bằng decision tree ở trên.
3. Xác định nơi đặt source:
   - L1: `registry/company/ui/primitives`.
   - L2: `registry/company/ui/components`.
   - L3 thấp: `registry/company/ui/composites`.
   - L4: `packages/patterns/src/patterns`.
   - L5 dùng chung rộng: `packages/patterns/src/templates`.
   - Business-specific: product app.
4. Đặt tên generic, không dùng tên page hoặc tên business entity.
5. Thiết kế API props trước khi code.
6. Thêm Storybook story.
7. Thêm test phù hợp với rủi ro.
8. Cập nhật registry dependency nếu component cần copy kèm component khác.
9. Đặt `status: "draft"` trong registry khi component chưa release-ready.
10. Review accessibility, keyboard interaction và token usage.
11. Đổi sang `status: "public"` khi đã sẵn sàng cho product dùng rộng.
12. Release hoặc hướng dẫn product add bằng `company-ui add`.

## Checklist phân loại

Trước khi merge, reviewer nên hỏi:

- Component này đang ở level nào?
- Nó có bị đặt cao hơn hoặc thấp hơn thực tế không?
- Nó có chứa business logic không?
- Nó có gọi API, đọc route, đọc permission không?
- Nó có import ngược từ level cao xuống level thấp không?
- Nó có thể được dùng bởi ít nhất 2 product/workflow không?
- Tên component có generic không?
- API có phụ thuộc vào entity cụ thể không?
- Story có minh họa state quan trọng không?
- Test có cover interaction/accessibility quan trọng không?

## Ví dụ phân loại yêu cầu

### Yêu cầu: "Cần nút lưu có loading"

Phân loại: **L1 Primitive**.

Tạo hoặc cập nhật `Button` với `isLoading`, `isDisabled`, `variant`, `size`.

Không tạo `SaveButton` trong Design System nếu nó chỉ khác text hoặc icon.

### Yêu cầu: "Cần input có label và error"

Phân loại: **L3 Composite**.

Dùng hoặc tạo `FormField` ghép `Label`, `Input`, `HelperText`, `ErrorMessage`.

Không nhét toàn bộ validation schema vào `FormField`.

### Yêu cầu: "Cần khu lọc danh sách có nhiều filter và nút apply/reset"

Phân loại: **L4 Pattern**.

Tạo `FilterPanel` nhận field config, value, `onChange`, `onApply`, `onReset`.

Không gọi API search trực tiếp trong pattern.

### Yêu cầu: "Cần màn hình danh sách chuẩn có title, filter, table, pagination"

Phân loại: **L5 Template**.

Tạo `ListPage` hoặc `ListPageTemplate` với slot cho header, filters, table, pagination, empty/loading/error.

Không hard-code entity như `CustomerListPage` trong Design System.

## Naming gợi ý

Tên nên mô tả vai trò UI, không mô tả business:

| Nên dùng | Tránh dùng |
| --- | --- |
| `DataTable` | `CustomerTable` |
| `FilterPanel` | `OrderFilterPanel` |
| `SearchBox` | `ProductSearchBox` nếu chỉ dùng được cho product |
| `FormPage` | `CreateInvoicePage` |
| `EmptyState` | `NoCustomerState` |

Nếu business name là phần không thể bỏ, component đó nên nằm trong product app.
