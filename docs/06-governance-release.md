# Governance & Release

## Mục tiêu

Governance giúp Design System phát triển có kiểm soát, tránh duplicate component, tránh breaking change âm thầm và giúp product adoption ổn định.

## Request flow

```txt
Request component
      ↓
Review UX/Design
      ↓
Check existing component
      ↓
Design token
      ↓
Implement
      ↓
Storybook
      ↓
Test
      ↓
Review
      ↓
Release
      ↓
Product consume
```

## Role responsibility

### BA

BA mô tả:

- User goal.
- Behavior.
- Validation rule.
- Wireframe hoặc flow.
- State cần có: loading, empty, error, disabled.

BA không quyết định:

- Button color.
- Border radius.
- Font size.
- Shadow.
- Component visual style nếu Design System đã có rule.

### Designer

Designer quyết định:

- Component có thuộc Design System không.
- Token nào cần dùng hoặc cần thêm.
- Variant/state/interaction.
- Do/don't.

Designer không tạo style riêng lẻ trái token nếu không có decision record.

### Design System Dev

Dev chịu trách nhiệm:

- Implement component/pattern.
- Đảm bảo accessibility.
- Đảm bảo API ổn định.
- Viết story/test.
- Chuẩn bị changeset.

### Product Dev

Product Dev chịu trách nhiệm:

- Consume package public.
- Không fork/copy component.
- Request nếu thiếu component hoặc variant.
- Báo issue nếu component không đáp ứng use case thật.

## Request acceptance criteria

Một request component/pattern được accept khi:

- Có use case rõ ràng.
- Không duplicate component hiện có.
- Có khả năng dùng lại.
- Có design/wireframe/state.
- Có owner review.
- Có priority theo roadmap.

## Contribution rule

Mọi contribution vào Design System phải có:

- Mô tả thay đổi.
- Screenshot hoặc Storybook link nếu thay đổi visual.
- Test hoặc lý do không cần test.
- Changeset nếu thay đổi public package.
- Review từ ít nhất một Design System maintainer.

## Release rule

Versioning dùng semantic versioning:

- Patch: bug fix không đổi API.
- Minor: thêm component, thêm prop, thêm variant backward compatible.
- Major: remove/rename token, đổi API, đổi behavior quan trọng, breaking visual contract.

## Changeset rule

Mỗi PR thay đổi public package cần changeset.

Ví dụ:

```txt
registry/button: minor

Add Dialog component with controlled and uncontrolled open state.
```

Không cần changeset cho:

- Internal tooling không ảnh hưởng package public.
- Docs-only nếu không publish docs như package.
- Test-only.

## Deprecation rule

Không remove API ngay nếu có thể deprecate trước.

Process:

```txt
Mark deprecated
      ↓
Document migration
      ↓
Release minor
      ↓
Wait agreed window
      ↓
Remove in major
```

## Breaking change rule

Breaking change phải có:

- Lý do.
- Impact.
- Migration guide.
- Example trước/sau.
- Version major.

## Review checklist

Trước khi merge:

- API rõ và nhất quán.
- Không hard-code token value.
- Accessibility đạt yêu cầu.
- Storybook đủ state.
- Test đủ behavior quan trọng.
- Không expose primitive trực tiếp.
- Không tạo dependency ngược.
- Build/typecheck pass.
