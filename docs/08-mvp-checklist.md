# MVP Checklist

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

- [ ] Khởi tạo pnpm workspace.
- [ ] Khởi tạo Turborepo.
- [ ] Tạo `apps/storybook`.
- [ ] Tạo `packages/tokens`.
- [ ] Tạo `packages/theme`.
- [ ] Tạo `packages/primitives`.
- [ ] Tạo `registry/company/ui`.
- [ ] Tạo `tooling/company-ui`.
- [ ] Tạo `packages/patterns`.
- [ ] Tạo `packages/icons`.
- [ ] Setup TypeScript base config.
- [ ] Setup ESLint/Prettier.
- [ ] Setup Changesets.

## Token checklist

- [ ] Color tokens.
- [ ] Typography tokens.
- [ ] Spacing tokens.
- [ ] Radius tokens.
- [ ] Shadow tokens.
- [ ] Breakpoint tokens.
- [ ] Z-index tokens.
- [ ] CSS variable output.
- [ ] Tailwind preset mapping.

## Component checklist

### Button

- [ ] Variants: primary, secondary, danger, ghost.
- [ ] Sizes: sm, md, lg.
- [ ] States: default, hover, focus, active, disabled, loading.
- [ ] With icon.
- [ ] Storybook stories.
- [ ] Tests.

### Input

- [ ] Sizes: sm, md, lg.
- [ ] States: default, focus, disabled, invalid.
- [ ] Prefix/suffix if needed.
- [ ] Storybook stories.
- [ ] Tests.

### Select

- [ ] Single select.
- [ ] Disabled.
- [ ] Invalid.
- [ ] Keyboard navigation.
- [ ] Storybook stories.
- [ ] Tests.

### Checkbox

- [ ] Checked/unchecked.
- [ ] Indeterminate.
- [ ] Disabled.
- [ ] Keyboard support.
- [ ] Storybook stories.
- [ ] Tests.

### Dialog

- [ ] Controlled/uncontrolled open state.
- [ ] Trigger.
- [ ] Header/title/body/footer.
- [ ] Focus trap.
- [ ] Close on escape behavior.
- [ ] Storybook stories.
- [ ] Tests.

### Table

- [ ] Header/body.
- [ ] Empty state.
- [ ] Loading state.
- [ ] Row actions slot.
- [ ] Responsive rule.
- [ ] Storybook stories.
- [ ] Tests.

### Form

- [ ] FormField.
- [ ] Label.
- [ ] Help text.
- [ ] Error message.
- [ ] Required indicator.
- [ ] Storybook stories.
- [ ] Tests.

### Pagination

- [ ] Page number.
- [ ] Previous/next.
- [ ] Disabled edge states.
- [ ] Page size option if needed.
- [ ] Storybook stories.
- [ ] Tests.

## Storybook checklist

- [ ] Overview page.
- [ ] Foundation page.
- [ ] Component pages.
- [ ] Pattern pages.
- [ ] Usage examples.
- [ ] Do/don't.
- [ ] Accessibility notes.
- [ ] Props docs.

## Release checklist

- [ ] Build packages.
- [ ] Typecheck pass.
- [ ] Lint pass.
- [ ] Test pass.
- [ ] Storybook build pass.
- [ ] Changeset added.
- [ ] Version updated.
- [ ] Release note written.

## Product pilot checklist

- [ ] Chọn 1 product pilot.
- [ ] Cài `@company/theme`.
- [ ] Chạy `company-ui add button input`.
- [ ] Replace Button/Input đầu tiên.
- [ ] Replace Dialog hoặc Table ở một flow thật.
- [ ] Ghi lại issue thiếu component/variant.
- [ ] Điều chỉnh API nếu cần trước khi rollout rộng.
