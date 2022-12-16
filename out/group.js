"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = exports.goGroupImports = void 0;
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const goGroupImports = () => __awaiter(void 0, void 0, void 0, function* () {
    const { activeTextEditor: editor, activeTextEditor: { document }, } = vscode_1.window;
    const documentText = document.getText();
    if (document.languageId !== 'go')
        return;
    const rootPkg = yield (0, utils_1.resolveRootPackage)();
    if (rootPkg === '') {
        vscode_1.window.showErrorMessage('Failed to resolve root project directory. No GOPATH variable or go.mod file found.');
        return;
    }
    // TODO show error
    const imports = (0, utils_1.getImports)(documentText);
    if (!imports.length)
        return;
    const groupedList = (0, exports.group)(imports, rootPkg);
    const importsRange = (0, utils_1.getImportsRange)(documentText);
    const edit = new vscode_1.WorkspaceEdit();
    const range = new vscode_1.Range(importsRange.start, 0, importsRange.end - 1, Number.MAX_VALUE);
    edit.replace(document.uri, range, importGroupsToString(groupedList));
    vscode_1.workspace.applyEdit(edit).then(document.save);
});
exports.goGroupImports = goGroupImports;
const isStdlibImport = (imp) => {
    return !imp.includes('.');
};
const isOwnImport = (imp, root) => {
    return imp.includes(root);
};
const group = (imports, rootPkg) => {
    const importGroups = {
        stdlib: [],
        thirdParty: [],
        own: [],
    };
    imports.forEach((imp) => {
        if (isOwnImport(imp, rootPkg)) {
            importGroups.own.push(imp);
        }
        else if (isStdlibImport(imp)) {
            importGroups.stdlib.push(imp);
        }
        else {
            importGroups.thirdParty.push(imp);
        }
    });
    return importGroups;
};
exports.group = group;
const importGroupsToString = (importGroups) => Object.keys(importGroups)
    .filter((key) => importGroups[key].length)
    .map((key) => importGroups[key].join('\n'))
    .join('\n\n');
//# sourceMappingURL=group.js.map