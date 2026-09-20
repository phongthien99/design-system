# Design System kiểu shadcn: đưa source vào product thay vì publish package

*Chia sẻ kỹ thuật về cách chúng tôi dựng Design System dùng chung cho nhiều frontend project với React, TypeScript, Base UI, pnpm workspace và một CLI tự viết. Các đoạn code trong bài lấy từ repo thật. Trạng thái số liệu tính đến 2026-09-20.*

---

## 1. Đặt vấn đề

### Cái đau

Nhiều project frontend cùng công ty, cùng stack React + TypeScript, và mỗi project đều cần `Button`, `Input`, `Select`, `Dialog`, `Table`, `Form`. Không có nguồn chung nên mỗi team tự dựng lại. Sau một thời gian ta gặp:

- **Lệch UI:** `border-radius: 6px` ở project này, `8px` ở project kia, màu primary mỗi nơi một mã hex.
- **Accessibility mỗi nơi một kiểu:** có nơi làm focus trap cho modal, có nơi quên restore focus, có nơi dropdown không dùng được bằng bàn phím.
- **Đổi brand tốn công:** màu hard-code rải trong hàng trăm file.
- **Không có contract giữa BA, Design, Dev:** "cái popup này" là Dialog, Popover hay Drawer thì mỗi người hiểu một kiểu.

### Hướng đầu tiên: publish `@company/ui`

Hướng hiển nhiên là gom component vào một package npm, product `pnpm add @company/ui` rồi `import { Button } from "@company/ui"`. Nó có ưu điểm là đơn giản, nhưng khi nhiều product cùng dùng thì lộ ra các vấn đề:

| Vấn đề | Chuyện xảy ra trong thực tế |
| --- | --- |
| **Version lockstep** | Sửa một prop của `Dialog` là product nào bump version cũng bị ảnh hưởng, và ai không kịp bump thì tụt lại |
| **Tùy biến khó** | Product cần một biến thể nhỏ thì phải fork hoặc override CSS bằng selector dài |
| **Breaking change khó kiểm soát** | Đổi behavior âm thầm, product vỡ mà không biết vì sao |
| **Khóa vào một primitive library** | Nếu API public lộ ra Base UI/Radix thì đổi thư viện nghĩa là major cho toàn bộ product |

Câu hỏi đặt ra: làm sao vừa có **một nguồn chuẩn** vừa để **mỗi product tự chủ tiến độ và tùy biến**?

---

## 2. Giải pháp

### 2.1. Registry model: copy source, không cài runtime

Chúng tôi chọn mô hình của [shadcn/ui](https://ui.shadcn.com): component nằm trong một **registry** tập trung, còn product chạy CLI để **copy source** vào codebase của mình.

```bash
company-ui add button
# → components/ui/button.tsx + lib/utils.ts xuất hiện trong product
```

```tsx
import { Button } from "@/components/ui/button"; // import từ source local
```

So sánh hai mô hình:

| | Runtime package (`@company/ui`) | Registry (copy source) |
| --- | --- | --- |
| Nơi code sống | `node_modules` | Repo của product |
| Nâng cấp | Bump version, đến ngay | Chủ động: `check` → xem diff → apply |
| Tùy biến | Fork hoặc override CSS | Sửa thẳng file |
| Breaking change | Ảnh hưởng ngay khi bump | Không tự động chạm vào product |
| Chi phí | Thấp | Cần CLI và cơ chế theo dõi lệch phiên bản |

Cái giá phải trả: sau khi copy, product **sở hữu** source. Nên phải có cơ chế để biết product đang lệch chuẩn ở đâu. Chúng tôi sẽ quay lại điểm này ở phần thực hiện, vì đây là chỗ khó nhất.

### 2.2. Kiến trúc phân tầng

```txt
Token → Theme → Primitive → Component → Pattern → Product
```

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

Quy tắc: mỗi tầng chỉ phụ thuộc tầng bên trái, và `@company/tokens` là package **duy nhất** bắt buộc dùng chung ở runtime.

### 2.3. Base UI làm engine, không làm public API

Phần tốn công nhất của UI library là hành vi: focus trap, keyboard navigation, portal, ARIA. Chúng tôi dùng [Base UI](https://base-ui.com) cho phần này và **chỉ giữ nó bên trong wrapper**. Product không import `@base-ui/react`. Nhờ vậy nếu sau này đổi engine, API public của công ty không đổi.

### 2.4. Token hai lớp

Token đi qua hai lớp, để đổi brand chỉ cần sửa lớp đầu:

```txt
raw token (--ds-color-primary-600)  →  semantic (--color-primary)  →  component
```

### 2.5. Phân loại component theo 5 cấp

Để BA, Design, Dev nói chung ngôn ngữ khi yêu cầu UI mới:

```txt
L1 Primitive → L2 Component → L3 Composite → L4 Pattern → L5 Template
Button          Input/Select   FormField       DataTable     ListPage
```

Quy tắc chặn: UI nào gọi API, biết route, permission, hay entity như `Order` hoặc `Invoice` thì **không** thuộc Design System.

---

## 3. Thực hiện

### 3.1. Cấu trúc monorepo

```txt
design-system/
├── apps/storybook/
├── packages/
│   ├── tokens/        # @company/tokens
│   ├── theme/         # @company/theme: CSS variables + Tailwind preset
│   ├── primitives/    # wrapper nội bộ quanh Base UI
│   ├── patterns/
│   └── icons/
├── registry/
│   ├── company/ui/    # source chuẩn: primitives/ components/ composites/ utils/
│   └── stories/
├── tooling/company-ui/  # CLI
└── registry.json
```

pnpm workspace + Turborepo để build song song, Changesets để versioning, ESLint (typescript-eslint, react-hooks, jsx-a11y) + Prettier để chặn lỗi sớm.

### 3.2. Token → Theme → Tailwind

Lớp raw token nằm ở `@company/tokens`, có tiền tố `--ds-` để không đụng biến của product:

```css
/* packages/tokens/src/tokens.css */
:root {
  --ds-color-primary-600: #1d4ed8;
  --ds-color-neutral-900: #111827;
  --ds-radius-md: 0.375rem;
  --ds-spacing-4: 1rem;
}
```

`@company/theme` ánh xạ sang tên **semantic**. Component chỉ được biết tên semantic:

```css
/* packages/theme/src/styles.css */
@import "@company/tokens/tokens.css";

:root {
  --color-primary: var(--ds-color-primary-600);
  --color-primary-hover: var(--ds-color-primary-700);
  --color-primary-foreground: var(--ds-color-neutral-0);
  --color-danger: var(--ds-color-danger-500);
  --color-ring: var(--ds-color-primary-500);
  --radius-md: var(--ds-radius-md);
}
```

Cùng bộ biến đó được xuất qua Tailwind preset để product dùng utility class mà vẫn ăn theo token:

```ts
// packages/theme/src/tailwind-preset.ts
colors: {
  primary: "var(--color-primary)",
  "primary-foreground": "var(--color-primary-foreground)",
  ring: "var(--color-ring)"
},
borderRadius: { md: "var(--radius-md)" }
```

Đổi brand thành đổi một dòng ở lớp semantic, không cần đụng component nào.

### 3.3. Một component cụ thể: Button

```tsx
// registry/company/ui/primitives/button/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as React from "react";
import { mergeStateClassName } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ComponentPropsWithoutRef<typeof ButtonPrimitive> & {
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<React.ElementRef<typeof ButtonPrimitive>, ButtonProps>(
  ({ children, className, disabled, isLoading = false, size = "md",
     type = "button", variant = "primary", ...props }, ref) => (
    <ButtonPrimitive
      ref={ref}
      className={mergeStateClassName(`ds-button ds-button--${variant} ds-button--${size}`, className)}
      data-loading={isLoading ? "true" : undefined}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <span aria-hidden="true" className="ds-button-spinner" /> : null}
      {children}
    </ButtonPrimitive>
  )
);
```

Vài quyết định nhỏ nhưng có lý do:

- **`type = "button"` mặc định.** HTML mặc định là `submit`, nên nếu không đặt thì nút trong `<form>` sẽ submit ngoài ý muốn.
- **`disabled={disabled || isLoading}`.** Khi loading, nút bị vô hiệu thật sự, chặn double-click và double-submit.
- **`ComponentPropsWithoutRef<typeof ButtonPrimitive>`.** Kế thừa toàn bộ prop của Base UI nên product không thiếu prop nào, nhưng API vẫn là của chúng tôi.
- **`forwardRef`.** Để composition với Tooltip, Popover, Dialog trigger hoạt động.
- **Spinner đặt `aria-hidden`.** Đây là trang trí thuần túy.

Chi tiết dễ bỏ sót: `className` của Base UI có thể là **hàm nhận state**, không chỉ string. Nếu ghép class kiểu `` `${base} ${className}` `` thì sẽ ra `"ds-button function..."`. Nên có helper:

```ts
// registry/company/ui/utils/utils.ts
export function mergeStateClassName<State>(
  baseClassName: string,
  className?: string | ((state: State) => string | undefined)
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }
  return cn(baseClassName, className);
}
```

CSS dùng BEM-like `ds-button--primary`, chỉ tham chiếu semantic variable, không có hex nào:

```css
.ds-button--primary { background: var(--color-primary); color: var(--color-primary-foreground); }
.ds-button--primary:not(:disabled):hover { background: var(--color-primary-hover); }

.ds-button:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }
.ds-button[data-loading="true"] { cursor: not-allowed; opacity: 0.6; }
```

Lưu ý thực tế: dù tài liệu ban đầu ghi "Tailwind", component hiện tại **không dùng utility class**. Style nằm trong CSS thường, bám `ds-*` và biến. Tailwind preset tồn tại để product dùng token trong code của họ.

### 3.4. Registry: metadata cho từng item

Mỗi component được khai báo bằng JSON theo schema của shadcn:

```json
{
  "name": "dialog",
  "type": "registry:ui",
  "dependencies": ["@base-ui/react", "@company/theme"],
  "registryDependencies": ["button", "utils"],
  "files": [
    { "path": "components/dialog/dialog.tsx", "type": "registry:ui", "target": "@ui/dialog.tsx" }
  ]
}
```

- `dependencies`: package npm cần cài.
- `registryDependencies`: item khác trong registry mà nó phụ thuộc.
- `target: "@ui/dialog.tsx"`: **placeholder** chứ không phải đường dẫn. CLI đọc `components.json` của product để biết `@ui` là `src/components/ui` hay `components/ui`.

Root `registry.json` chỉ include registry con, nên có thể tách nhiều registry sau này:

```json
{ "name": "company", "include": ["registry/company/ui/registry.json"] }
```

### 3.5. CLI `company-ui`: TypeScript thuần, không thêm dependency runtime

Các lệnh: `list`, `add`, `check`, `diff`, `update`. Ba phần thú vị nhất là:

**a) Giải dependency đệ quy, có phát hiện vòng.**

```ts
if (stack.includes(itemName)) {
  throw new Error(`Circular registry dependency: ${[...stack, itemName].join(" -> ")}`);
}
for (const dependency of item.registryDependencies ?? []) {
  await installItem({ ...args, itemName: dependency, stack: [...stack, itemName] });
}
```

Chạy thử trên product trống, `add dialog` tự kéo theo `button` và `utils`:

```txt
$ company-ui add dialog
Wrote lib/utils.ts
Wrote components/ui/button.tsx
Added @base-ui/react to package.json dependencies.
Added @company/theme to package.json dependencies.
Wrote components/ui/dialog.tsx
```

**b) Không bao giờ ghi đè.**

```ts
if (existsSync(destination) && !options.force) {
  messages.push(`Skipped existing file: ${target}`);
  continue;
}
```

**c) Theo dõi phiên bản bằng hash nội dung.** Mỗi item được băm gồm metadata và **nội dung file**, lưu vào `company-ui.json` của product:

```ts
async function hashItem(item: ResolvedRegistryItem) {
  const hash = createHash("sha256");
  hash.update(item.name);
  hash.update(JSON.stringify(item.dependencies ?? []));
  hash.update(JSON.stringify(item.registryDependencies ?? []));
  for (const file of item.files ?? []) {
    hash.update(file.path);
    hash.update(await readFile(path.resolve(item.registryDir, file.path), "utf8"));
  }
  return hash.digest("hex");
}
```

Hash cấp item cho biết metadata hoặc nội dung có đổi không. Nhưng như mục 3.6 sẽ cho thấy, chỉ một hash cho cả item là **không đủ** để `check` nói đúng. Cách tracking cuối cùng dùng thêm hash cho từng file.

### 3.6. Lỗ hổng phát hiện khi tự dùng thử

Đây là phần chúng tôi thấy có giá trị nhất để chia sẻ. Kịch bản: product **đã có sẵn** `button.tsx` (bản cũ, hoặc tự sửa), rồi chạy `add button`.

```txt
$ company-ui add button
Wrote lib/utils.ts
Skipped existing file: components/ui/button.tsx     ← đúng, không ghi đè
...
$ company-ui check
button: up to date                                   ← SAI
$ cat components/ui/button.tsx
// OLD LOCAL VERSION                                 ← file vẫn là bản cũ
```

Nguyên nhân: `installItem` vẫn ghi `hash: await hashItem(item)` vào `company-ui.json` **kể cả khi file bị skip**. Hash đó là hash của bản *registry*, không phải của file *đang nằm trong product*. Hệ quả có hai tầng:

1. Sau một lần skip, `check` báo "up to date" dù source local đã lệch.
2. Ngay cả khi không skip, `check` chỉ trả lời câu hỏi "registry có đổi so với lúc add không", **không** trả lời "product đã sửa file chưa". Nếu product sửa `button.tsx` thì `check` vẫn báo `up to date`.

Nói cách khác, ta chỉ có một nửa của bài toán ba chiều.

**Cách sửa.** Lưu hash của **từng file** làm baseline (nội dung source registry tại thời điểm add), rồi `check` so ba thứ cho mỗi file:

```txt
baseline  (hash source registry lúc add, lưu trong company-ui.json)
local     (hash file hiện tại trong product)
upstream  (hash source registry hiện tại)
```

```ts
export function classifyFile(baseline, local, upstream): FileState {
  if (local === undefined) return "missing locally";
  if (local === upstream) return "up to date";
  if (baseline === undefined) return "differs from registry";
  if (local === baseline) return "update available"; // chỉ upstream đổi: apply an toàn
  if (upstream === baseline) return "modified locally"; // chỉ product đổi: giữ nguyên
  return "conflict"; // cả hai cùng đổi: phải diff và review
}
```

Hai chi tiết nhỏ quyết định tính đúng:

- Khi `add` gặp file có sẵn và bỏ qua, baseline vẫn được ghi (hoặc giữ baseline cũ nếu đã có). Nhờ vậy re-add không thể che mất `update available`.
- Baseline là hash của thứ *registry đã có*, không phải của thứ *đã ghi xuống đĩa*, nên file bị skip sẽ lộ ra là `modified locally` thay vì `up to date`.

Chạy lại kịch bản lỗi ở trên:

```txt
$ company-ui check
button: modified locally
  components/ui/button.tsx: modified locally
```

Và khi registry đổi (đã bump lên 0.2.0) trong lúc product đã tùy biến `button`:

```txt
$ company-ui check
Registry version: 0.2.0
button: conflict (registry 0.1.0 -> 0.2.0)
  components/ui/button.tsx: conflict
dialog: update available (registry 0.1.0 -> 0.2.0)
  components/ui/dialog.tsx: update available
```

Logic phân loại được tách thành hàm thuần (`tracking.ts`) nên có unit test cho toàn bộ bảng chân trị. Đây cũng là lý do rule của chúng tôi là `diff → review → apply`: `update` bỏ qua component đang `conflict` thay vì ghi đè.

**Lỗi thứ hai, tìm ra khi thử bản sửa.** `add dialog --force` vô tình ghi đè luôn `button` mà product vừa tùy biến, vì `--force` lan xuống các registry dependency. Sửa: `--force` chỉ áp cho item được yêu cầu, dependency luôn cài không `--force`.

### 3.6.1. Version: ba lớp, và vì sao cần cả ba

Sau khi có hash từng file, câu hỏi tiếp theo là "vậy version thì sao?". Chúng tôi làm lần lượt hai bước, và bước sau là do bước đầu chưa đủ.

**Bước 1: version cả registry bằng Changesets.** Changesets chỉ bump được **workspace package**, còn `registry/company/ui` là một thư mục source. Cách gọn: đặt một `package.json` ngay trong đó (`@company/registry`, `private`), thêm thư mục vào `pnpm-workspace.yaml`. Khi đó `changeset status` đòi changeset lúc PR sửa registry, và `changeset version` bump số kèm `CHANGELOG.md`.

Chỗ chưa đủ: cả registry chỉ có **một số**. `0.1.0 → 0.2.0` không cho product biết `button` đổi hay `dialog` đổi, và đổi ở mức nào.

**Bước 2: version từng item.** shadcn schema không có field `version`, nhưng có field `meta` là object tự do (`additionalProperties: true`), nên version nằm ở `meta.version`:

```json
{ "name": "button", "type": "registry:ui", "meta": { "version": "0.1.1" }, "files": [...] }
```

Changesets không làm được cấp item, nên chúng tôi tự viết một script nhỏ (`scripts/registry-version.mjs`) gồm bốn lệnh:

```bash
pnpm registry:register                  # item mới ghi ở 0.1.0
pnpm registry:bump dialog minor -m "add aria-labelledby wiring"
pnpm registry:check                     # fail nếu item đổi mà chưa bump
pnpm registry:log dialog                # lịch sử một item
```

State nằm ở `registry/company/ui/versions.json` (sổ cái: version, hash, lịch sử từng item). Hai chi tiết khiến nó khớp với phần còn lại:

- **Hash dùng đúng thuật toán của CLI** (`hashItem`: name, type, status, dependencies, registryDependencies, path, target và nội dung file). Đã kiểm chứng hash trong sổ cái bằng đúng hash mà CLI ghi vào `company-ui.json` của product.
- **`bump` tự tạo changeset** cho `@company/registry` cùng mức bump, nên hai cấp version không lệch nhau. Nhiều item bump trong một PR thì Changesets gộp: version registry lấy mức cao nhất, changelog liệt kê từng item.

```txt
$ pnpm registry:check          # sau khi sửa dialog và button, chưa bump
button: changed since 0.1.0, needs a bump (run: pnpm registry:bump button <patch|minor|major> -m "...")
dialog: changed since 0.1.0, needs a bump (run: ...)

$ pnpm registry:bump dialog minor -m "add aria-labelledby wiring"
dialog: 0.1.0 -> 0.2.0 (minor)

$ company-ui check             # trong product đang ở dialog 0.1.0
dialog: update available (0.1.0 -> 0.2.0)
```

CLI đọc `meta.version` và ghi vào `company-ui.json`, nên product thấy đúng câu "button 0.1.0 → 0.1.1" thay vì một số chung của cả registry.

| Lớp | Nguồn | Trả lời câu hỏi |
| --- | --- | --- |
| Version item | `meta.version` + `versions.json` | "Component này đổi ở mức nào?" |
| Version registry | `@company/registry` + Changesets | "Cả registry có gì mới?" (release note) |
| Hash từng file | `company-ui.json` | "File của tôi có lệch chuẩn không?" |

Ba lớp không thay thế nhau. Version cho biết *mức* đổi nhưng không biết product đã sửa file chưa. Hash biết đúng điều đó nhưng không biết mức.

Đánh đổi cần nói thẳng: **mức bump do người chọn.** Công cụ chỉ biết "đã đổi hay chưa" (qua hash), không suy ra được patch hay major từ diff. Chọn sai mức thì CLI vẫn chạy đúng nhưng số version sẽ nói sai về độ nghiêm trọng. Ngoài ra `registry:check` hiện chưa chạy trong CI, nên đang dựa vào việc tự chạy trước khi mở PR.

### 3.7. Storybook sinh từ chính registry

Mỗi story component đọc metadata từ `registry.json` và render qua một shell chung:

```tsx
const item = registry.items.find((e) => e.name === "button") as RegistryStoryItem;

const meta = {
  title: "Registry/Primitives/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger", "ghost"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    className: { table: { disable: true } }   // không expose prop nội bộ
  },
  render: () => <RegistryStoryShell item={item} />
} satisfies Meta<typeof Button>;
```

Shell hiển thị lệnh cài, dependencies, target file lấy từ metadata, nên **tài liệu không thể lệch khỏi registry**. Mỗi component có story `Overview` và `Playground`. Hiện có 41 story theo cách này.

### 3.8. Sandbox cá nhân

Để thử nghiệm mà không làm bẩn source chuẩn, có `scripts/personal.mjs`:

```bash
pnpm personal:sync   # copy registry/company/ui → registry/personal (không ghi đè nếu không --force)
pnpm personal:diff   # so sánh sandbox với bản chuẩn
```

Script rewrite import và title của story bằng regex (ví dụ `/company/ui` → `/ui`) để sandbox chạy độc lập với bộ story riêng.

### 3.9. Những lỗi và giới hạn khác

| Vấn đề | Chi tiết | Trạng thái |
| --- | --- | --- |
| Hash không phát hiện sửa local | Mục 3.6 | Đã sửa (baseline hash từng file, `check` ba chiều) |
| Style nằm ngoài source được copy | TSX được copy vào product nhưng class `ds-*` sống trong `@company/theme`. Product sửa TSX vẫn phụ thuộc theme CSS, nên đây là mô hình **lai**, khác shadcn thuần (style ở ngay trong file) | Đánh đổi có chủ đích, cần ghi rõ |
| `@company/theme: "latest"` | CLI ghi `latest` vì item không pin version, trong khi package đang `private` và chưa publish | Chưa sửa |
| `add` một tên mỗi lệnh | `add button dialog` chỉ add `button` | Đã sửa (`add` nhận nhiều tên) |
| `--force` lan sang dependency | Ghi đè cả component đã tùy biến trong `registryDependencies` | Đã sửa (chỉ áp cho item được yêu cầu) |
| `check` luôn thoát mã 0 | Chưa dùng làm gate CI cho product được, kể cả khi có `conflict` | Chưa sửa |
| Mức bump do người chọn | Công cụ chỉ phát hiện "đã đổi", không suy ra patch/minor/major, xem 3.6.1 | Đánh đổi có chủ đích |
| `registry:check` chưa chạy trong CI | Đang dựa vào tự chạy trước khi mở PR | Chưa sửa |
| Phải truyền `--registry` | CLI tìm `registry.json` ngược lên từ `--cwd`, product nằm ngoài repo thì không thấy | Chưa sửa |
| `FormField` thiếu a11y | `<label>` không có `htmlFor`, `description`/`error` chưa nối qua `aria-describedby` | Chưa sửa |
| `Button` loading chưa có `aria-busy` | Spinner `aria-hidden` nên screen reader không biết nút đang loading | Chưa sửa |
| 39 lỗi TS2322 ở story sinh tự động | Đổi `PlaygroundConfig.component` sang `ComponentType<any>` | Đã sửa (đánh đổi type-safety ở lớp story) |

---

## 4. Kết luận

### Đã có

- Pipeline chạy end-to-end: token → theme → registry → CLI → source trong product.
- Registry phủ **toàn bộ public export của `@base-ui/react@1.8.0`**: 41 item, trong đó 10 item đã style hoàn chỉnh (`button`, `input`, `checkbox`, `dialog`, `form-field`, `select`, `switch`, `tabs`, `tooltip`, `popover`), 31 item là headless wrapper.
- CLI tự giải dependency giữa các item, không ghi đè, và `check` / `diff` / `update` theo dõi lệch phiên bản bằng hash baseline từng file, kèm version từng item (`meta.version`) và version release của registry (`@company/registry`).
- Storybook sinh từ registry nên docs không drift.
- `pnpm build`, `typecheck`, `lint`, `format:check` đều pass.

### Chưa có (nói thẳng)

- **Test cho component:** chưa có. Mới có unit test cho logic phân loại của CLI (9 test). `pnpm test` cho các package còn lại xanh vì chạy với `--passWithNoTests`, nên đừng đọc "pass" thành "đã test".
- **Table và Pagination:** chưa bắt đầu, hai component MVP còn thiếu.
- **Test end-to-end cho luồng `add` → `check` → `update`**, và exit code khác 0 để dùng làm gate CI.
- **CI, visual test, a11y gate:** a11y ở Storybook đang ở mức `todo`.
- **Product pilot:** chưa có, nên mọi giả định về API mới chỉ được thử trên product giả.

### Bài học kỹ thuật

1. **Registry đổi bài toán, không làm nó biến mất.** Runtime package khó ở chỗ bump version. Registry khó ở chỗ theo dõi lệch phiên bản sau khi đã copy. Đầu tư vào `diff`/`update` từ sớm, đừng coi `check` một chiều là đủ.
2. **Hash cái gì quan trọng hơn hash thế nào.** Băm bản registry cho biết upstream đổi, không cho biết local đổi. Muốn phân biệt được "cập nhật an toàn", "product tự sửa" và "xung đột" thì phải lưu baseline từng file và so ba chiều.
3. **Bọc primitive library ở đúng một lớp.** Kế thừa `ComponentPropsWithoutRef` của Base UI giúp không mất prop, mà API public vẫn là của mình. Nhưng nhớ những thứ như `className` dạng hàm, nếu không ghép class sẽ hỏng.
4. **Sinh docs từ metadata.** Khi story đọc thẳng từ `registry.json`, không có chuyện README nói một đằng, registry một nẻo.
5. **Phủ rộng dễ hơn phủ sâu.** Wrap 41 component khá nhanh. Đưa từng cái tới mức "xong" (style, a11y, test, docs) mới là phần tốn thời gian.
6. **Tự dùng thử sớm.** Lỗ hổng ở 3.6 chỉ lộ ra khi chạy `add` trên một product đã có file sẵn, và lỗi `--force` lan sang dependency chỉ lộ ra khi thử bản sửa. Đọc thiết kế thì không thấy cả hai.
7. **Chọn công cụ theo thứ nó version được.** Changesets version package, không version thư mục. Biến registry thành một package (không publish) là cách rẻ nhất để có version và changelog cấp registry. Nhưng nếu cần version từng component thì phải tự viết thêm một lớp mỏng, và nên để nó tự tạo changeset để hai cấp không lệch nhau.

### Bước tiếp theo

1. Cho `check` thoát mã khác 0 khi có `conflict` hoặc `update available`, rồi dựng CI.
2. Viết test đầu tiên cho Button, Input, Checkbox, Dialog và test end-to-end cho CLI.
3. Làm Table và Pagination.
4. Sửa a11y của `FormField`, thêm `aria-busy` cho Button loading.
5. Chạy `pnpm registry:check` trong CI, add bump đầu tiên và chọn một product làm pilot.

---

*Nếu bạn đang cân nhắc giữa runtime package và registry: registry cho product nhiều quyền tự chủ hơn, nhưng bạn phải tự xây (hoặc dùng) công cụ để biết product đã lệch chuẩn ở đâu. Hãy tính chi phí đó trước khi chọn.*
