# Smart Quotes

A VS Code extension that converts between straight (`"`, `'`) and curly (`“`, `”`, `‘`, `’`) quotes and apostrophes in body text, markdown, and prose.

## Commands

All three commands operate on the active editor's selection. If no text is selected, they format the entire file.

| Command | Behavior |
| --- | --- |
| `Smart Quotes: Curl` | Converts straight quotes/apostrophes to the correct curly variant. Curly characters are left alone. |
| `Smart Quotes: Straighten` | Converts curly quotes/apostrophes back to straight. Straight characters are left alone. |
| `Smart Quotes: Toggle` | If the text contains any straight quotes/apostrophes, curls everything. Otherwise straightens everything. Mirrors the bold/italic toggle behavior in text editors. |

## Direction rules

When curling:

- A `"` becomes `“` (open) when it follows the start of the document, whitespace, or an opening bracket (`(`, `[`, `{`) or already-emitted opening curly. Otherwise it becomes `”` (close).
- A `'` follows the same rule, becoming `‘` (open) or `’` (close) — which means apostrophes inside words like `don't` always become `don’t`.

## Keybindings

No default keybindings are registered to avoid conflicts. To assign your own:

1. Open **Preferences: Open Keyboard Shortcuts** (`Ctrl+K Ctrl+S` / `Cmd+K Cmd+S`).
2. Search for `Smart Quotes`.
3. Bind `smartQuotes.curl`, `smartQuotes.straighten`, and `smartQuotes.toggle` to whatever keys you prefer.

## Development

```bash
pnpm install
pnpm run watch       # esbuild watch mode
# Press F5 in VS Code to launch the Extension Development Host
pnpm test            # run the unit test suite
pnpm run typecheck   # tsc --noEmit
```
