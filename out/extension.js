'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const group_1 = require("./group");
const register_1 = require("./register");
function activate(context) {
    let disposable = vscode_1.commands.registerCommand('extension.goGroupImports', group_1.goGroupImports);
    context.subscriptions.push(disposable);
    (0, register_1.updateSaveRegistration)();
    vscode_1.workspace.onDidChangeConfiguration(register_1.updateSaveRegistration);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map