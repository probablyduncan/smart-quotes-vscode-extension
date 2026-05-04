import * as vscode from "vscode";
import { curl, straighten, toggle } from "./quoteFormatter";

type Formatter = (input: string) => string;

async function applyFormatter(format: Formatter): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const document = editor.document;
	const allEmpty = editor.selections.every((sel) => sel.isEmpty);

	await editor.edit((builder) => {
		if (allEmpty) {
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(document.getText().length),
			);
			builder.replace(fullRange, format(document.getText()));
			return;
		}

		for (const selection of editor.selections) {
			if (selection.isEmpty) {
				continue;
			}
			builder.replace(selection, format(document.getText(selection)));
		}
	});
}

export function activate(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
		vscode.commands.registerCommand("proseQuotes.curl", () =>
			applyFormatter(curl),
		),
		vscode.commands.registerCommand("proseQuotes.straighten", () =>
			applyFormatter(straighten),
		),
		vscode.commands.registerCommand("proseQuotes.toggle", () =>
			applyFormatter(toggle),
		),
	);
}

export function deactivate(): void {
	// no-op
}
