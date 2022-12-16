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
exports.getImportsRange = exports.getImports = exports.resolveRootPackage = exports.moduleRegex = exports.multilineImportsGroupRegex = void 0;
const path = require("path");
const vscode_1 = require("vscode");
const { readdir, readFile } = require('fs').promises;
exports.multilineImportsGroupRegex = /import \(([^)]+)\)/;
exports.moduleRegex = /module (.*?)\n/;
const fileInGOPATH = (gopath) => {
    if (!gopath) {
        return false;
    }
    const pwd = vscode_1.window.activeTextEditor.document.fileName;
    const relative = path.relative(gopath, pwd);
    const include = pwd.includes(relative);
    if (!include) {
        return false;
    }
    return true;
};
const resolveRootPackageWithGOPATH = () => {
    const pwd = vscode_1.window.activeTextEditor.document.fileName;
    const trimmedPwd = pwd.replace(path.join(process.env.GOPATH, 'src/', ''), '');
    const rootPkg = trimmedPwd.split(path.sep).slice(0, 2).join(path.sep);
    return rootPkg;
};
const resolveRootPackage = () => {
    if (fileInGOPATH(process.env.GOPATH)) {
        return resolveRootPackageWithGOPATH();
    }
    const pwd = vscode_1.window.activeTextEditor.document.fileName;
    const currentFolder = pwd.split(path.sep).slice(0, -1).join(path.sep);
    return getRootDir(currentFolder, 10)
        .then((rootDir) => {
        return readFile(rootDir + '/go.mod');
    })
        .then((data) => {
        var name = '';
        const matches = exports.moduleRegex.exec(data);
        if (matches !== null) {
            name = matches[1];
        }
        return name;
    });
};
exports.resolveRootPackage = resolveRootPackage;
const getRootDir = (dir, depthLimit) => __awaiter(void 0, void 0, void 0, function* () {
    const dirents = (yield readdir(dir, { withFileTypes: true }));
    const goModFile = dirents.find((dirent) => dirent.name === 'go.mod');
    if (goModFile) {
        return dir;
    }
    const newDir = dir.split(path.sep).length > 1 &&
        dir.split(path.sep).slice(0, -1).join(path.sep);
    if (depthLimit > 0 && newDir) {
        return getRootDir(newDir, depthLimit - 1);
    }
    return '';
});
const getImports = (documentText) => {
    const importsMatch = documentText.match(exports.multilineImportsGroupRegex);
    if (!importsMatch || importsMatch.length < 2) {
        return [];
    }
    return importsMatch[1].split('\n').filter((line) => line.trim() != '');
};
exports.getImports = getImports;
const getImportsRange = (documentText) => {
    let start = 1; // lines in vs code are numereted from 1
    for (var line of documentText.split('\n')) {
        if (line.includes('import (')) {
            break;
        }
        start++;
    }
    let end = start;
    for (var line of documentText.split('\n').slice(start)) {
        if (line.includes(')')) {
            break;
        }
        end++;
    }
    return {
        end,
        start,
    };
};
exports.getImportsRange = getImportsRange;
//# sourceMappingURL=utils.js.map