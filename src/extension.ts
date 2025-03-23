import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let changeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    if (
      (event.document.languageId !== "javascriptreact" &&
        event.document.languageId !== "typescriptreact") ||
      event.contentChanges.length !== 1
    ) {
      return;
    }

    const change = event.contentChanges[0];

    if (change.rangeLength > 0 || change.text.length !== 1) {
      return;
    }

    const document = editor.document;
    const position = change.range.start.translate(0, 1);
    const line = document.lineAt(position.line);
    const textBefore = line.text.substring(0, position.character);
    const char = change.text;

    if (char === "=") {
      editor
        .edit((editBuilder) => {
          editBuilder.insert(position, "''");
        })
        .then(() => {
          editor.selection = new vscode.Selection(
            position.translate(0, 1),
            position.translate(0, 1)
          );
        });
    } else if (
      (char === "'" || char === '"') &&
      textBefore.slice(-2, -1) === "="
    ) {
      editor
        .edit((editBuilder) => {
          editBuilder.insert(position, char);
        })
        .then(() => {
          editor.selection = new vscode.Selection(position, position);
        });
    }
  });

  context.subscriptions.push(changeDisposable);
}

export function deactivate() {}
