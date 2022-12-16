import { window } from 'vscode';
import { goGroupImports } from './group';

export const groupImportsOnSave = () => {
  if (!window.activeTextEditor.document.languageId.includes('go')) {
    return;
  }
  return goGroupImports();
};
