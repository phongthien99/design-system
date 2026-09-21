# MVP Checklist

Cập nhật lần cuối: 2026-09-20. Trạng thái dưới đây được kiểm tra trực tiếp trên repo (đọc source, chạy `pnpm typecheck`, `pnpm test`, `pnpm build` và thử `company-ui add` trên một product giả), không suy từ docs cũ.

Quy ước: `[x]` đã có và đã kiểm tra; `[ ]` chưa có hoặc chưa được xác nhận. Ghi chú sau dấu `—` giải thích phần còn thiếu.

## Tóm tắt tiến độ

| Hạng mục | Trạng thái |
| --- | --- |
| Foundation (monorepo, packages, registry, CLI) | Xong |
| Tokens + Theme | Xong phần lõi, còn thiếu breakpoint CSS var và preset cho spacing/typography |
| Component MVP | 6/8 có bản styled (Button, Input, Select, Checkbox, Dialog, Form); **chưa có Table và Pagination** |
| Registry | 41 UI item (40 export của `@base-ui/react@1.8.0` + `form-field`) và `utils`; 10 item có style, 31 item là headless wrapper |
| Test | **Chưa có test nào** (`vitest --passWithNoTests` nên `pnpm test` vẫn xanh) |
| Storybook | Build pass, typecheck pass, 41 component story + catalog + EmptyState; chưa có Foundation/Overview page, a11y ở mức `error` (`pnpm test:storybook`) |
| Release gate | Build, typecheck, lint, Storybook build đều pass |
| Product pilot | Chưa bắt đầu |

## MVP scope

MVP đầu tiên cần đủ để bắt đầu ép product dùng chung UI:

- Tokens.
- Theme.
- Button.
- Input.
- Select.
- Checkbox.
- Dialog.
- Table.
- Form.
- Pagination.
- Storybook.

## Foundation checklist

- [x] Khởi tạo pnpm workspace.
- [x] Khởi tạo Turborepo.
- [x] Tạo `apps/storybook`.
- [x] Tạo `packages/tokens`.
- [x] Tạo `packages/theme`.
- [x] Tạo `packages/primitives` — mới wrap Dialog và Checkbox.
- [x] Tạo `registry/company/ui`.
- [x] Tạo `tooling/company-ui`.
- [x] Tạo `packages/patterns` — mới có `EmptyState`.
- [x] Tạo `packages/icons` — mới có `CheckIcon`.
- [x] Setup TypeScript base config.
- [x] Setup ESLint/Prettier — `eslint.config.js` (typescript-eslint, react-hooks, jsx-a11y) và `.prettierrc.json`; chạy `pnpm lint`, `pnpm format:check`.
- [x] Setup Changesets — có `.changeset/config.json` và package `@company/registry` (`registry/company/ui/package.json`) để version cả registry; chưa có changeset nào được add. Lưu ý `baseBranch` là `main` nhưng repo đang ở nhánh `master` và chưa có nhánh `main`, nên `changeset status` chỉ chạy được với `--since=master`.

## Token checklist

- [x] Color tokens — primary, neutral, success, warning, danger.
- [x] Typography tokens.
- [x] Spacing tokens.
- [x] Radius tokens.
- [x] Shadow tokens.
- [ ] Breakpoint tokens — có trong `@company/tokens` (TS) nhưng chưa xuất ra CSS variable.
- [x] Z-index tokens.
- [x] CSS variable output — `packages/tokens/src/tokens.css`, semantic variables trong `packages/theme/src/styles.css`.
- [x] Tailwind preset mapping — mới map colors, radius, shadow, z-index; chưa map spacing/typography.

## Component checklist

Chưa component nào có test, nên mục `Tests` của mọi component bên dưới đều chưa xong.

### Button

- [x] Variants: primary, secondary, danger, ghost.
- [x] Sizes: sm, md, lg.
- [ ] States: default, hover, focus, active, disabled, loading — đã có hover, focus-visible, disabled, loading; thiếu style `:active`.
- [ ] With icon — chưa có icon slot/prop; `@company/icons` mới có `CheckIcon`.
- [x] Storybook stories.
- [ ] Tests.

### Input

- [x] Sizes: sm, md, lg.
- [x] States: default, focus, disabled, invalid — invalid qua prop `isInvalid` / `aria-invalid`.
- [ ] Prefix/suffix if needed — chưa có.
- [x] Storybook stories.
- [ ] Tests.

### Select

- [x] Single select.
- [x] Disabled — trigger và item.
- [ ] Invalid — chưa có style/prop.
- [ ] Keyboard navigation — do Base UI cung cấp, chưa có test xác nhận.
- [x] Storybook stories.
- [ ] Tests.

### Checkbox

- [x] Checked/unchecked.
- [x] Indeterminate.
- [x] Disabled.
- [ ] Keyboard support — do Base UI cung cấp, chưa có test xác nhận.
- [x] Storybook stories.
- [ ] Tests.

### Dialog

- [x] Controlled/uncontrolled open state — `Dialog` là `Root` của Base UI.
- [x] Trigger.
- [x] Header/title/body/footer — có Header, Title, Description, Footer, Close; chưa có `DialogBody` riêng.
- [ ] Focus trap — do Base UI cung cấp, chưa có test xác nhận.
- [ ] Close on escape behavior — do Base UI cung cấp, chưa có test xác nhận.
- [x] Storybook stories.
- [ ] Tests.

### Table

Chưa bắt đầu. Base UI không có Table nên đây là component tự thiết kế, chưa có item trong registry.

- [ ] Header/body.
- [ ] Empty state — `EmptyState` pattern đã có, chưa gắn vào Table.
- [ ] Loading state.
- [ ] Row actions slot.
- [ ] Responsive rule.
- [ ] Storybook stories.
- [ ] Tests.

### Form

- [x] FormField — `registry/company/ui/composites/form-field`.
- [x] Label.
- [x] Help text — prop `description`.
- [x] Error message — prop `error`.
- [ ] Required indicator — chưa có.
- [x] Storybook stories.
- [ ] Tests.

Lưu ý a11y: `FormField` render `<label>` không có `htmlFor` và không nối `description`/`error` bằng `aria-describedby`. Cần sửa (hoặc dựng lại trên `field` của Base UI) trước khi coi là release-ready.

### Pagination

Chưa bắt đầu, chưa có item trong registry.

- [ ] Page number.
- [ ] Previous/next.
- [ ] Disabled edge states.
- [ ] Page size option if needed.
- [ ] Storybook stories.
- [ ] Tests.

## Storybook checklist

- [ ] Overview page — mới có trang `Registry/All Components`, chưa có trang giới thiệu Design System.
- [ ] Foundation page — chưa có trang token/color/typography.
- [x] Component pages — 41 story trong `registry/stories/generated`, mỗi component có `Overview` và `Playground`.
- [ ] Pattern pages — mới có `EmptyState`.
- [x] Usage examples — `registry/stories/component-previews.tsx`.
- [ ] Do/don't.
- [x] Accessibility gate — `parameters.a11y.test = "error"`, chạy bằng `pnpm test:storybook`. Notes riêng từng component vẫn chưa có.
- [x] Props docs — `autodocs` bật toàn cục và có `argTypes` cho playground.

## Release checklist

Kết quả chạy ngày 2026-09-20:

- [x] Build packages — `pnpm build` pass (7/7 task).
- [x] Typecheck pass — `pnpm typecheck` và `pnpm typecheck:registry` đều pass (đã sửa lỗi TS2322 bằng cách đổi `PlaygroundConfig.component` sang `ComponentType<any>`).
- [x] Lint pass — `pnpm lint` (ESLint) và `pnpm format:check` (Prettier) đều pass.
- [ ] Test pass — lệnh pass nhưng vì không có test file nào; chưa tính là đạt.
- [x] Storybook build pass.
- [ ] Changeset added.
- [ ] Version updated.
- [ ] Release note written.

## Product pilot checklist

- [ ] Chọn 1 product pilot.
- [ ] Cài `@company/theme` — hiện là package `private`, chưa publish nên product ngoài repo chưa cài được.
- [ ] Chạy `company-ui add button input` — CLI hiện chỉ nhận **một** tên mỗi lệnh, chạy `add button dialog` sẽ chỉ add `button`.
- [ ] Replace Button/Input đầu tiên.
- [ ] Replace Dialog hoặc Table ở một flow thật.
- [ ] Ghi lại issue thiếu component/variant.
- [ ] Điều chỉnh API nếu cần trước khi rollout rộng.

Đã thử thủ công trên một product giả (`package.json` + `components.json` từ `templates/`): `company-ui add button --cwd <product> --registry <repo>/registry.json` ghi được `lib/utils.ts`, `components/ui/button.tsx`, `company-ui.json`, thêm dependency vào `package.json`, và `check` báo `up to date`. Nếu không truyền `--registry`, CLI tìm `registry.json` ngược lên từ `--cwd` nên báo lỗi với product nằm ngoài repo này.

## Việc nên làm tiếp (theo thứ tự)

1. Viết test đầu tiên cho Button, Input, Checkbox, Dialog rồi mới tick các mục `Tests`.
2. Làm Table và Pagination — hai component MVP còn thiếu hoàn toàn.
3. Sửa a11y của `FormField`, thêm required indicator.
4. Cho `company-ui add` nhận nhiều tên, và cho phép dùng không cần `--registry` (hoặc cấu hình registry mặc định).
5. Setup ESLint/Prettier, bật a11y test ở Storybook.
6. Add changeset đầu tiên và chọn product pilot.
