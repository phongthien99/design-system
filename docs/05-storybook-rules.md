# Storybook Rules

## Mục tiêu

Storybook là portal chính cho Design System. Đây là nơi BA, Design, Dev và Product xem usage, state, rule và ví dụ.

## Story structure

Mỗi component nên có:

```txt
Overview
Usage
Do / Don't
Props
States
Examples
Accessibility
```

Story file:

```txt
button.stories.tsx
```

Story list ví dụ cho Button:

```txt
Default
Primary
Secondary
Danger
Disabled
Loading
With Icon
```

## Required stories

Mỗi component cần có tối thiểu:

- Default.
- All variants.
- All sizes.
- Disabled state.
- Error/invalid state nếu là form control.
- Loading state nếu là action component.
- With icon nếu component hỗ trợ icon.
- Controlled/uncontrolled nếu component hỗ trợ cả hai.

## Usage docs rule

Docs phải trả lời:

- Khi nào dùng component này?
- Khi nào không dùng?
- API chính là gì?
- Có variant nào?
- Có state nào?
- Accessibility cần chú ý gì?

## Do / Don't rule

Mỗi component quan trọng nên có Do / Don't.

Ví dụ Button:

Do:

- Dùng `primary` cho hành động chính của màn hình hoặc modal.
- Dùng `danger` cho hành động phá hủy dữ liệu.
- Dùng loading khi action async đang chạy.

Don't:

- Không dùng nhiều primary button trong cùng một action group.
- Không dùng danger cho hành động không phá hủy.
- Không tự override màu primary bằng className.

## Story controls rule

Storybook controls nên expose:

- `variant`.
- `size`.
- `disabled`.
- `loading`.
- `children` nếu phù hợp.

Controls không nên expose prop nội bộ.

## Accessibility docs rule

Mỗi interactive component cần note:

- Keyboard behavior.
- Focus behavior.
- ARIA behavior.
- Label requirement.

Ví dụ Dialog:

- `Esc` đóng dialog nếu behavior cho phép.
- Focus được trap trong dialog.
- Focus quay về trigger sau khi đóng.
- Dialog cần title accessible.

## Pattern story rule

Pattern story phải mô phỏng workflow thật hơn component story.

Ví dụ DataTable story nên có:

- Loading.
- Empty.
- Error.
- With filters.
- With pagination.
- Row selection nếu support.

## Documentation done rule

Component không được release nếu Storybook thiếu:

- Story default.
- Story variants.
- Story states quan trọng.
- Usage note.
- Props hoặc API docs.

