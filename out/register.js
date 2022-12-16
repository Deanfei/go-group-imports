"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaveRegistration = exports.getOnSaveSetting = void 0;
const vscode_1 = require("vscode");
const groupOnSave_1 = require("./groupOnSave");
let saveRegistration;
const unregisterWillSaveTextDocument = () => {
    if (!saveRegistration) {
        return;
    }
    saveRegistration.dispose();
    saveRegistration = null;
};
const registerWillSaveTextDocument = () => {
    if (saveRegistration) {
        return;
    }
    saveRegistration = vscode_1.workspace.onWillSaveTextDocument(groupOnSave_1.groupImportsOnSave);
};
const getOnSaveSetting = () => {
    return vscode_1.workspace.getConfiguration('groupImports').get('onSave');
};
exports.getOnSaveSetting = getOnSaveSetting;
const updateSaveRegistration = () => (0, exports.getOnSaveSetting)()
    ? registerWillSaveTextDocument()
    : unregisterWillSaveTextDocument();
exports.updateSaveRegistration = updateSaveRegistration;
//# sourceMappingURL=register.js.map