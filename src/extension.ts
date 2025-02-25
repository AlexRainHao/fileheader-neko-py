import * as vscode from "vscode";

const _headerTemplate = `# -*- coding: utf-8 -*-

"""
@Description: 🐈
@Author: your-email@gmail.com
@Copyright 2025 - 2025
@Date: 2025-02-25 22:33:05
@Version: __Dev__
"""

`;

const _stateKey = "isFileHeaderNekoPyEnabled";

export function activate(context: vscode.ExtensionContext) {

	console.log("Extension `fileheader-neko-py` is now active!");

	let _isEnabled = context.globalState.get<boolean>(_stateKey, true);

	let enableCommand = vscode.commands.registerCommand("fileheader-neko-py.enable", () => {
		_isEnabled = true;
		context.globalState.update(_stateKey, true);
		vscode.window.showInformationMessage("fileheader-neko-py enabled");
	});

	let disableCommand = vscode.commands.registerCommand("fileheader-neko-py.disable", () => {
		_isEnabled = false;
		context.globalState.update(_stateKey, false);
		vscode.window.showInformationMessage("fileheader-neko-py disabled");
	});


	const watcher = vscode.workspace.createFileSystemWatcher("**/*.py");

	watcher.onDidCreate(async (uri) => {
		if (!_isEnabled) { return; }

		const doc = await vscode.workspace.openTextDocument(uri);

		const editor = new vscode.WorkspaceEdit();

		editor.insert(uri, new vscode.Position(0, 0), _headerTemplate);
		await vscode.workspace.applyEdit(editor);
		await doc.save();
	});

	context.subscriptions.push(enableCommand, disableCommand, watcher);
}

export function deactivate() {
	console.log("Extension `fileheader-neko-py` is now deactivated!");
}
