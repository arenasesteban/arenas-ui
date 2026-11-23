# Button

Button is the first public Arenas UI component. It uses native HTML and CSS classes; no Arenas UI browser runtime is required.

## Base class

`btn` applies the default primary appearance.

## Modifiers

| Category     | Classes                                                    |
| ------------ | ---------------------------------------------------------- |
| Presentation | `btn-outline`, `btn-ghost`                                 |
| Color        | `btn-secondary`, `btn-success`, `btn-warning`, `btn-error` |
| Size         | `btn-sm`, `btn-md`, `btn-lg`                               |
| Shape        | `btn-pill`, `btn-square`, `btn-circle`                     |
| Layout       | `btn-block`                                                |
| Visual state | `btn-loading`                                              |

## Examples

```html
<button type="button" class="btn">Continue</button>

<button type="button" class="btn btn-outline btn-lg">Cancel</button>

<button type="button" class="btn btn-success btn-outline">Save</button>

<button type="button" class="btn btn-pill">Contact</button>

<button type="button" class="btn" disabled>Disabled</button>
```

## Composition rules

Use one color, one presentation variant, one size, and one shape at most. Modifiers from different categories may be combined.

Contradictory combinations are unsupported. HTML class order does not determine variant precedence.

## Accessibility

- Prefer native `<button>` elements for actions.
- Set `type="button"` when the control must not submit a form.
- Native `disabled` prevents activation and removes the button from sequential keyboard navigation.
- Icon-only controls require an accessible name, such as `aria-label`.
- `btn-loading` is visual only. Consumers manage `disabled`, `aria-busy`, loading announcements, and the actual asynchronous operation.
- Links styled with `btn` retain native link semantics. Use an anchor only for navigation.
- `aria-disabled="true"` does not prevent navigation or activation. Consumers must manage unavailable link behavior explicitly.

## Customization

Colors and dimensions use public `--aui-*` tokens. Consumers may override them within a CSS scope.

Tailwind utility classes can override supported component properties through the CSS cascade without routine use of `!important`.

The Arenas UI `data-theme` contract does not automatically change Tailwind's `dark:*` behavior.
