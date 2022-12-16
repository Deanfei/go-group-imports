import { Range, window, workspace, WorkspaceEdit, Position } from 'vscode';
import { resolveRootPackage, getImportsRange, getImports } from './utils';

export const goGroupImports = async () => {
  const {
    activeTextEditor: editor,
    activeTextEditor: { document },
  } = window;
  const documentText = document.getText();

  if (document.languageId !== 'go') return;

  const rootPkg = await resolveRootPackage();
  if (rootPkg === '') {
    window.showErrorMessage(
      'Failed to resolve root project directory. No GOPATH variable or go.mod file found.'
    );
    return;
  }
  // TODO show error

  const imports = getImports(documentText);

  if (!imports.length) return;

  const groupedList = group(imports, rootPkg);

  const importsRange = getImportsRange(documentText);

  const edit = new WorkspaceEdit();
  const range = new Range(
    importsRange.start,
    0,
    importsRange.end - 1,
    Number.MAX_VALUE
  );
  edit.replace(document.uri, range, importGroupsToString(groupedList));
  workspace.applyEdit(edit).then(document.save);
};

type ImportGroups = {
  stdlib: string[];
  thirdParty: string[];
  own: string[];
};

const isStdlibImport = (imp: string): boolean => {
  return !imp.includes('.');
};

const isOwnImport = (imp: string, root: string): boolean => {
  return imp.includes(root);
};

export const group = (imports: string[], rootPkg: string): ImportGroups => {
  const importGroups = <ImportGroups>{
    stdlib: [],
    thirdParty: [],
    own: [],
  };

  imports.forEach((imp) => {
    if (isOwnImport(imp, rootPkg)) {
      importGroups.own.push(imp);
    } else if (isStdlibImport(imp)) {
      importGroups.stdlib.push(imp);
    } else {
      importGroups.thirdParty.push(imp);
    }
  });

  return importGroups;
};

const importGroupsToString = (importGroups: ImportGroups): string =>
  Object.keys(importGroups)
    .filter((key) => importGroups[key].length)
    .map((key) => importGroups[key].join('\n'))
    .join('\n\n');
