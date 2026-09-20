# Component Definition of Done Checklist

Checklist này dùng ngay sau khi viết xong code của một component, trước khi mở PR. Nó cụ thể hóa [Definition of Done](00-vision-principles.md#definition-of-done), [Component Rules](04-component-rules.md), [Storybook Rules](05-storybook-rules.md) và [Governance & Release](06-governance-release.md) thành các việc cần tick, kèm đường dẫn và lệnh cho repo hiện tại.

Copy checklist vào phần mô tả PR và tick từng mục. Mục nào không áp dụng thì ghi `N/A` kèm lý do, không bỏ trống.

Ký hiệu: **(gate)** là bước đã có lệnh tự động chạy được. **(thủ công)** là bước hiện chưa có gate tự động, người làm và reviewer phải tự kiểm.

---

## 0. Trước khi coi là "code xong"

- [ ] Đã trả lời 6 câu hỏi của [New component request rule](04-component-rules.md#new-component-request-rule): chưa tồn tại, không ghép được từ component hiện có, có ít nhất 2 product/workflow cần, API đủ generic, token đủ dùng, không phải pattern.
- [ ] Đã xác định đúng cấp theo [Component Taxonomy](13-component-taxonomy-levels.md) và đặt đúng thư mục.
- [ ] Component không gọi API, không biết route, permission hay entity nghiệp vụ (`Order`, `Invoice`...). Nếu có thì đây là code của product, không đưa vào Design System.

| Cấp | Thư mục |
| --- | --- |
| L1 Primitive | `registry/company/ui/primitives/<name>/<name>.tsx` |
| L2 Component | `registry/company/ui/components/<name>/<name>.tsx` |
| L3 Composite | `registry/company/ui/composites/<name>/<name>.tsx` |

---

## 1. API

- [ ] Props theo quy ước: `variant` cho visual intent, `size` (`sm` / `md` / `lg`, mặc định `md`), state boolean dạng `isLoading` / `isDisabled` / `isInvalid`.
- [ ] Event handler đặt tên `onClick`, `onXChange`, `onOpenChange`.
- [ ] Nhận `className` để product chỉnh layout, và không dùng `className` để đổi core style.
- [ ] Với component phức tạp (Dialog, Select, Tabs): dùng composition API (`Root`, `Trigger`, `Content`...).
- [ ] Không tạo variant hoặc size theo tên page hoặc product. Mỗi variant có mục đích rõ.
- [ ] Props có kiểu TypeScript export được; không dùng `any` (trừ chỗ đã có lý do ghi chú).
- [ ] API ổn định, dễ hiểu hơn là "thông minh". Tránh những prop kiểu `visualPreset="dense-brand-stateful"`.

## 2. Token và style

- [ ] Không hard-code màu, radius, spacing, shadow (`#1677ff`, `6px`, `rounded-[6px]`). Dùng token hoặc semantic variable (`var(--color-primary)`, `var(--radius-md)`).
- [ ] Nếu thiếu token: thêm vào `packages/tokens` (và `packages/theme` nếu cần semantic variable), không viết giá trị lẻ vào component.
- [ ] Style class `ds-*` nằm trong `packages/theme/src/styles.css`, đặt tên theo mẫu hiện có (`ds-button--primary`, `ds-button--md`).
- [ ] Đã kiểm tra hiển thị với theme hiện có (light/dark nếu theme đã hỗ trợ).
- [ ] Nếu component là headless wrapper chưa style thì ghi rõ trong mô tả registry item và story để product biết cần tự style.

## 3. State

Đủ các state sau (bỏ mục nào không áp dụng và ghi lý do):

- [ ] Default
- [ ] Hover
- [ ] Focus visible
- [ ] Active (`:active`)
- [ ] Disabled
- [ ] Loading, nếu có action bất đồng bộ
- [ ] Invalid / error, nếu là form control
- [ ] Controlled và uncontrolled, nếu component hỗ trợ cả hai

## 4. Accessibility

Đây là mặc định, không phải tùy chọn.

- [ ] Điều khiển được hoàn toàn bằng bàn phím (Tab, Enter, Space, Esc, phím mũi tên tùy component).
- [ ] Focus visible rõ ràng, không `outline: none` mà không thay thế.
- [ ] Control không có text có `aria-label` hoặc label liên kết đúng.
- [ ] Form control expose `aria-invalid`, và nối `description` / `error` qua `aria-describedby`; `<label>` có `htmlFor` hoặc dùng `Field` của Base UI.
- [ ] Disabled thật thì không focus, không click.
- [ ] Overlay (Dialog, Popover, Tooltip): focus trap và restore focus đúng, có accessible title, Esc đóng khi phù hợp.
- [ ] Base UI chỉ nằm sau wrapper: không export hoặc yêu cầu product import trực tiếp từ `@base-ui/react`.
- [ ] Chạy `jsx-a11y` qua `pnpm lint` (gate) và xem tab Accessibility trong Storybook không có violation (thủ công, vì a11y test đang ở mức `todo`).

## 5. Test

Test tối thiểu theo [Testing rule](04-component-rules.md#testing-rule). Hiện repo chưa có test file nào và chưa chốt vị trí đặt test, nên component đầu tiên có test nên đặt cạnh source (`<name>.test.tsx`) để làm mẫu cho các component sau.

- [ ] Render không lỗi.
- [ ] Disabled không kích hoạt action.
- [ ] Loading hiển thị đúng.
- [ ] Keyboard interaction với component interactive.
- [ ] ARIA attribute quan trọng (`aria-invalid`, `aria-describedby`, role...).
- [ ] `pnpm test` chạy và có test thật sự được thực thi. Lưu ý lệnh dùng `--passWithNoTests`, nên "pass" một mình không chứng minh có test.

## 6. Registry

- [ ] Thêm hoặc cập nhật item trong `registry/company/ui/registry.json`: `name`, `type: "registry:ui"`, `title`, `description`, `dependencies`, `registryDependencies`, `files[].path` và `files[].target`.
- [ ] `dependencies` liệt kê đủ những gì component import (`@base-ui/react`, `@company/theme`...). `registryDependencies` liệt kê các item registry khác mà nó dùng (`utils`, `button`...).
- [ ] Đường dẫn `files[].path` khớp cấp thư mục ở mục 0.
- [ ] Nếu rebuild `registry.personal.json` hoặc sandbox có liên quan, chạy `pnpm personal:diff` để xác nhận không lệch ngoài ý muốn.
- [ ] Đã kiểm tra `pnpm company-ui list` thấy component mới.
- [ ] Đã thử `company-ui add <name>` trên một product giả (hoặc product thật) và chắc chắn file ghi đúng chỗ, `package.json` được thêm đúng dependency, `company-ui check` báo `up to date` (và báo `update available` khi bạn sửa source trong registry, để chắc chắn `check` thấy được thay đổi của chính component này):

```bash
pnpm build
pnpm company-ui add <name> --cwd /path/to/product --registry "$PWD/registry.json"
pnpm company-ui check --cwd /path/to/product --registry "$PWD/registry.json"
```

## 7. Storybook và docs

Vị trí: `registry/stories/generated/<name>.stories.tsx`. Playground và preview khai báo ở `registry/stories/playgrounds.tsx` và `registry/stories/component-previews.tsx`. Title theo cấp, ví dụ `Registry/Primitives/Button`.

Story tối thiểu:

- [ ] Default (`Overview` / `Playground`).
- [ ] Tất cả variant.
- [ ] Tất cả size.
- [ ] Disabled.
- [ ] Invalid, nếu là form control.
- [ ] Loading, nếu là action component.
- [ ] With icon, nếu component hỗ trợ icon.
- [ ] Controlled / uncontrolled, nếu hỗ trợ cả hai.

Nội dung docs:

- [ ] Khi nào dùng và khi nào không dùng.
- [ ] API chính, variant, state (`argTypes` cho playground, `autodocs` đã bật toàn cục).
- [ ] Do / Don't (bắt buộc với component quan trọng).
- [ ] Ghi chú accessibility: keyboard, focus, ARIA, yêu cầu label.
- [ ] Controls chỉ expose prop công khai (`variant`, `size`, `disabled`, `loading`, `children`), ẩn prop nội bộ như `className`.
- [ ] Nếu là pattern: story mô phỏng workflow thật (loading, empty, error, filter, pagination...).

## 8. Kiểm tra tự động trước khi mở PR

Chạy đủ và đều phải xanh:

```bash
pnpm lint            # ESLint (gate)
pnpm format:check    # Prettier (gate); dùng pnpm format để tự sửa
pnpm typecheck       # gồm typecheck:registry (gate)
pnpm test            # có test thật chạy, không chỉ passWithNoTests
pnpm build           # 7/7 task, gồm Storybook build (gate)
```

- [ ] Tất cả lệnh trên pass.
- [ ] Storybook mở lên, đã tự xem component trong browser: mọi story render, tương tác bằng chuột và bàn phím đều đúng.
- [ ] Không có phụ thuộc ngược (component không import từ product hay từ `@company/ui`; pattern không phụ thuộc runtime UI).

## 9. Versioning và release

- [ ] Component mới: `pnpm registry:register` để ghi ở `0.1.0`. Component đã có: `pnpm registry:bump <item> <patch|minor|major> -m "..."`. Lệnh này tăng `meta.version`, ghi `versions.json` và **tự tạo changeset** cho `@company/registry` (xem [Changeset rule](06-governance-release.md#changeset-rule)). Mức bump theo [Release rule](06-governance-release.md#release-rule): thêm component, prop hoặc variant tương thích ngược là `minor`; sửa lỗi không đổi API là `patch`; đổi API hoặc behavior quan trọng là `major`.
- [ ] Nếu breaking change: có lý do, impact, migration guide, ví dụ trước/sau, và bump major.
- [ ] Nếu deprecate: đánh dấu deprecated, ghi migration, chưa xóa ngay.
- [ ] Không cần changeset cho: tooling nội bộ, docs-only, test-only.
- [ ] `pnpm registry:check` pass (không còn item đổi mà chưa bump).
- [ ] Ghi release note.

## 10. Cập nhật tài liệu dự án

- [ ] Cập nhật [MVP Checklist](08-mvp-checklist.md): tick đúng mục, ghi chú phần còn thiếu.
- [ ] Cập nhật số liệu và danh sách trong [README](../README.md) (số item registry, số item đã style) và [Registry Implementation Audit](12-registry-implementation-audit.md) nếu thay đổi.

## 11. PR và review

PR description gồm ([Contribution rule](06-governance-release.md#contribution-rule)):

- [ ] Mô tả thay đổi.
- [ ] Ảnh chụp hoặc link Storybook nếu thay đổi visual.
- [ ] Test, hoặc lý do không cần test.
- [ ] Changeset (nếu áp dụng).
- [ ] Checklist này đã tick.

Review:

- [ ] Review từ Design: variant, state, token, do/don't.
- [ ] Review từ Dev (Design System maintainer): API, accessibility, test, không lộ Base UI.
- [ ] Ít nhất một Design System maintainer approve.

---

## Tóm tắt một dòng cho mỗi bước

| # | Nhóm | Câu hỏi để tự kiểm |
| --- | --- | --- |
| 0 | Phạm vi | Component này có thật sự thuộc Design System và đúng cấp chưa? |
| 1 | API | Product dùng có dễ đoán và ổn định không? |
| 2 | Token | Có giá trị style nào hard-code không? |
| 3 | State | Đủ hover, focus, active, disabled, loading, invalid chưa? |
| 4 | A11y | Dùng được chỉ bằng bàn phím và screen reader không? |
| 5 | Test | Có test thật chạy, không chỉ `passWithNoTests`? |
| 6 | Registry | `company-ui add` ra source đúng, dependency đủ? |
| 7 | Storybook | Người khác đọc story có biết khi nào dùng, dùng thế nào? |
| 8 | Tự động | lint, format, typecheck, test, build đều xanh? |
| 9 | Release | Đã `registry:bump` đúng mức, có changeset đi kèm? |
| 10 | Docs | Checklist, README, audit đã khớp thực tế? |
| 11 | Review | Design và Dev maintainer đã duyệt? |

## Những chỗ chưa có gate tự động

Các mục dưới đây hiện dựa vào việc tự kiểm và review, vì repo chưa có công cụ chặn:

- Chặn hard-code token (chưa có lint rule).
- A11y ở Storybook (`parameters.a11y.test` đang là `todo`).
- Test bắt buộc (`--passWithNoTests`).
- CI workflow chạy các lệnh ở mục 8 và visual test.
- `company-ui diff` / `update` (mới có `check`).

Khi các gate này được dựng, chuyển các mục tương ứng từ **(thủ công)** sang **(gate)** và cập nhật tài liệu này.
