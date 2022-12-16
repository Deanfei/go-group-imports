"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupImportsOnSave = void 0;
const vscode_1 = require("vscode");
const group_1 = require("./group");
const groupImportsOnSave = () => {
    if (!vscode_1.window.activeTextEditor.document.languageId.includes('go')) {
        return;
    }
    return (0, group_1.goGroupImports)();
};
exports.groupImportsOnSave = groupImportsOnSave;
//# sourceMappingURL=groupOnSave.js.map