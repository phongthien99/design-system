# Build Log: Xây dựng Design System cho Product

> Ghi chép quá trình dựng Design System dùng chung cho nhiều frontend product: vì sao làm, chọn hướng nào, làm được gì và còn thiếu gì.
>
> Số liệu lấy từ trạng thái repo ngày **2026-09-20**. Chi tiết từng hạng mục xem [MVP Checklist](08-mvp-checklist.md) và [Registry Implementation Audit](12-registry-implementation-audit.md).

---

## 1. Đặt vấn đề

### Bối cảnh

Công ty có nhiều frontend project chạy song song. Mỗi project đều cần những thứ giống nhau: Button, Input, Select, Dialog, Table, Form. Không có nguồn chung, nên mỗi team tự dựng lại.

### Triệu chứng

| Vấn đề | Hậu quả |
| --- | --- |
| Mỗi product tự viết lại Button, Input, Modal | Trùng lặp code, sửa một chỗ phải sửa nhiều nơi |
| Màu, radius, spacing hard-code rải rác (`#1677ff`, `6px`) | UI lệch nhau giữa các product, đổi brand rất tốn công |
| Accessibility làm tùy hứng | Focus, keyboard, aria, overlay mỗi nơi một kiểu, dễ lỗi |
| BA, Design, Dev không có chung ngôn ngữ | Yêu cầu "cái popup này" nghĩa là gì thì mỗi người hiểu một kiểu; tranh luận style lặp lại ở từng project |
| Không có quy trình yêu cầu / review / release component | Component mới xuất hiện tùy ý, thay đổi break product mà không ai biết |

### Ràng buộc khi chọn giải pháp

1. Nhiều product dùng chung, nhưng **mỗi product có tiến độ và nhu cầu tùy biến riêng**. Một bản nâng cấp không được tự động làm vỡ product khác.
2. Team đã dùng React, TypeScript, Tailwind. Không muốn đổi stack.
3. Không muốn tự viết lại logic accessibility (focus trap, keyboard navigation, portal) từ đầu.
4. Design System phải là **một contract giữa BA, Design, Dev và Product**, không chỉ là thư viện component.

---

## 2. Giải pháp

### 2.1. Kiến trúc phân tầng

```txt
Token → Theme → Primitive → Component → Pattern → Product
```

Mỗi tầng chỉ phụ thuộc tầng bên trái. Token là nguồn sự thật cho visual foundation; product là nơi cuối cùng ghép mọi thứ.

### 2.2. Các quyết định chính

**Quyết định 1: Registry model (kiểu shadcn) thay vì runtime package**

Ban đầu hướng tự nhiên là publish một package `@company/ui` cho product cài. Nhưng model này buộc mọi product đi cùng một version và rất khó tùy biến cục bộ.

Thay vào đó, component nằm trong một **Company UI Registry**. Product chạy `company-ui add button` để **copy source** vào codebase của mình, rồi import từ local (`@/components/ui/button`).

```txt
                  @company/tokens
                        |
Base UI ------> Company UI Registry
                        |
                 company-ui add button
                        |
                        v
                 Product Source
```

- Product sở hữu source sau khi add, tùy biến được.
- Registry vẫn là source chuẩn; release mới **không tự động** thay đổi product.
- Đổi lại, cần CLI có `check` / `diff` / `update` để product không bị "trôi" khỏi chuẩn.

**Quyết định 2: Base UI làm engine, không làm public API**

Base UI xử lý accessibility, keyboard, focus, portal. Nhưng product **không import trực tiếp** `@base-ui/react`; chỉ thấy component đã được wrap và style của Design System. Nhờ đó sau này có thể đổi primitive mà không đổi API công khai.

**Quyết định 3: Token first**

Component không được hard-code giá trị style. Mọi thứ đi qua token và semantic CSS variable:

```css
/* Tránh */
color: #1677ff;
border-radius: 6px;

/* Dùng */
color: var(--color-primary);
border-radius: var(--radius-md);
```

**Quyết định 4: Phân loại component theo 5 cấp**

Để mọi người "nói cùng một ngôn ngữ" khi yêu cầu UI mới:

```txt
L1 Primitive → L2 Component → L3 Composite → L4 Pattern → L5 Template
```

Ví dụ: `Button` là L1, `Input`/`Select` là L2, `FormField`/`Pagination` là L3, `DataTable`/`FilterPanel` là L4, `ListPage` là L5. Nếu UI gọi API, biết route, permission hay entity như `Order`, `Invoice` thì **không thuộc Design System**, mà thuộc product.

**Quyết định 5: "Done" có định nghĩa rõ**

Một component chỉ được coi là xong khi có: API rõ ràng, variant/size/state, dùng đúng token, accessibility, Storybook, usage docs, test tối thiểu, review từ Design và Dev, và changeset/release note.

### 2.3. Tech stack

React, TypeScript, Tailwind CSS, Base UI, Storybook, pnpm workspace + Turborepo, Changesets, Vitest, ESLint + Prettier.

---

## 3. Thực hiện

### 3.1. Cấu trúc repo

```txt
design-system/
├── apps/storybook/          # cổng documentation
├── packages/
│   ├── tokens/              # @company/tokens
│   ├── theme/               # @company/theme (CSS variables, Tailwind preset)
│   ├── primitives/          # wrapper nội bộ quanh Base UI
│   ├── patterns/            # pattern dùng chung (L4/L5)
│   └── icons/
├── registry/
│   ├── company/ui/          # source chuẩn của component
│   │   ├── primitives/
│   │   ├── components/
│   │   └── composites/
│   └── stories/             # story cho từng component
├── tooling/company-ui/      # CLI: list / add / check
└── docs/                    # 14 tài liệu rule & kế hoạch
```

### 3.2. Các bước đã làm

**Bước 1: Viết rule trước khi viết code.**
Toàn bộ nguyên tắc, governance, rule về token, component, Storybook và registry được viết thành 14 tài liệu trong `docs/`. Việc này giúp BA, Design, Dev thống nhất trước khi bắt tay vào code.

**Bước 2: Dựng nền monorepo.**
pnpm workspace, Turborepo, TypeScript base config, Changesets, ESLint (typescript-eslint, react-hooks, jsx-a11y) và Prettier.

**Bước 3: Token và Theme.**
`@company/tokens` có color (primary, neutral, success, warning, danger), typography, spacing, radius, shadow, z-index. `@company/theme` map token sang semantic CSS variables như `--color-background`, `--color-primary`, `--color-border`, kèm Tailwind preset.

**Bước 4: Registry và CLI `company-ui`.**
Registry theo schema shadcn (`registry.json`). CLI có 3 lệnh:

```bash
company-ui list                  # liệt kê component
company-ui add button            # copy source + cài dependency + ghi company-ui.json
company-ui check                 # so hash để báo component nào đã lệch chuẩn
```

CLI không ghi đè file đã có nếu không có `--force`, và lưu hash của từng registry item để phát hiện thay đổi.

**Bước 5: Phủ toàn bộ component của Base UI.**
Registry hiện cover **toàn bộ public export của `@base-ui/react@1.8.0`**, tổng 41 UI item. Trong đó:

- **10 item đã style hoàn chỉnh:** `button`, `input`, `checkbox`, `dialog`, `form-field`, `select`, `switch`, `tabs`, `tooltip`, `popover`.
- **31 item là headless wrapper:** product vẫn add được và style dần.

**Bước 6: Storybook.**
41 story component (mỗi component có `Overview` và `Playground`), một trang `Registry/All Components` và story `EmptyState`. Đã cài addon docs, a11y, vitest.

**Bước 7: Thử với một product giả.**
Chạy `company-ui add button` trên product giả: file `lib/utils.ts`, `components/ui/button.tsx`, `company-ui.json` được ghi, `package.json` được cập nhật, `check` báo `up to date`.

### 3.3. Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| `pnpm build` | Pass (7/7 task, gồm Storybook build) |
| `pnpm typecheck` / `typecheck:registry` | Pass |
| `pnpm lint` / `pnpm format:check` | Pass |
| `pnpm test` | Pass, nhưng **chưa có test file nào** nên không tính là đạt |
| `company-ui add button` trên product giả | Pass |

### 3.4. Vấn đề gặp phải và cách xử lý

| Vấn đề | Cách xử lý |
| --- | --- |
| `typecheck` fail 39 lỗi TS2322 ở các story sinh tự động | Đổi kiểu `PlaygroundConfig.component` sang `ComponentType<any>` trong `registry/stories/playgrounds.tsx` |
| `packages/ui` (runtime package) mâu thuẫn với Registry model | Xóa hẳn `packages/ui` khỏi repo, Storybook, tsconfig và lockfile; source chuẩn chuyển sang `registry/company/ui` |
| Chữ "Primitive" bị dùng hai nghĩa | Tách rõ: *L1 Primitive UI* (Button, Badge...) khác *headless primitive* (wrapper Base UI trong `packages/primitives`) |
| Muốn thử nghiệm mà không làm bẩn source chuẩn | Thêm sandbox `registry/personal` với `pnpm personal:sync` / `personal:diff` |

### 3.5. Giới hạn đã biết

Những điều được phát hiện khi tự dùng thử, chưa xử lý:

- `company-ui add` chỉ nhận **một** tên mỗi lệnh (`add button dialog` chỉ add `button`).
- CLI tìm `registry.json` ngược lên từ `--cwd`, nên product nằm ngoài repo phải truyền `--registry <path>`.
- Dependency nội bộ như `@company/theme` được ghi vào `package.json` với version `latest`, trong khi package này đang `private`, chưa publish.
- `FormField` render `<label>` không có `htmlFor` và chưa nối `description`/`error` bằng `aria-describedby`. Cần sửa trước khi coi là release-ready.
- Button chưa có style `:active` và chưa có icon slot.
- Tailwind preset mới map colors, radius, shadow, z-index; breakpoint mới có ở dạng TypeScript, chưa xuất ra CSS variable.

---

## 4. Kết luận

### Đã đạt được

- Có một **nền tảng kiến trúc rõ ràng**: token → theme → registry → CLI → Storybook, cùng bộ rule cho cả BA, Design và Dev.
- Có **quy trình phân phối component** chạy được end-to-end: từ registry đến source trong product, có theo dõi phiên bản bằng hash.
- Có **độ phủ rộng**: 41 component, trong đó 10 component đã style, 6/8 component MVP đã có bản styled (Button, Input, Select, Checkbox, Dialog, Form).
- Build, typecheck, lint và Storybook build đều xanh.

### Chưa đạt được (nói thẳng)

| Hạng mục | Trạng thái |
| --- | --- |
| Table, Pagination | Chưa bắt đầu (Base UI không có Table, phải tự thiết kế) |
| Test | Chưa có test nào; mọi mục `Tests` trong checklist đều chưa tick |
| CI workflow, visual test, a11y gate | Chưa có; a11y ở Storybook đang ở mức `todo` |
| `diff` / `update` trong CLI | Mới có `check` |
| Changeset, version, release note | Chưa có |
| **Product pilot** | **Chưa bắt đầu** |

Điểm cuối quan trọng nhất: Design System chưa được kiểm chứng bằng một product thật. Mọi giả định về API và cách dùng mới chỉ được thử trên product giả.

### Bài học

1. **Viết rule trước, code sau** giúp tránh tranh luận lặp lại, nhưng dễ dẫn tới docs đi trước thực tế. Cần cập nhật checklist dựa trên kết quả chạy thật, không chỉ suy từ docs cũ.
2. **Chọn model phân phối sớm.** Chuyển từ `@company/ui` sang registry giữa chừng tốn công xóa và dọn dẹp; quyết định này nên chốt ở Phase 0.
3. **Phủ rộng dễ hơn phủ sâu.** Wrap toàn bộ Base UI khá nhanh, nhưng đưa từng component đến mức "Done" (style, a11y, test, docs) mới là phần tốn thời gian.
4. **`pnpm test` xanh không có nghĩa là có test.** Cờ `--passWithNoTests` che mất khoảng trống này.

### Bước tiếp theo (theo thứ tự ưu tiên)

1. Viết test đầu tiên cho Button, Input, Checkbox, Dialog.
2. Làm Table và Pagination để đủ MVP.
3. Sửa a11y của `FormField`, thêm required indicator.
4. Cho `company-ui add` nhận nhiều tên và có registry mặc định.
5. Bật a11y test ở Storybook, dựng CI workflow.
6. Add changeset đầu tiên và **chọn một product làm pilot**.
