export { getIconSuggestion, IconSuggestion } from './iconSuggestion';

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatName(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toSingular(str: string): string {
  if (str.endsWith('ies')) {
    return str.replace(/ies$/, 'y');
  }

  return str.replace(/s$/, '');
}

export function toPlural(str: string): string {
  if (str.endsWith('s')) {
    return str;
  }

  if (str.endsWith('y')) {
    return str.replace(/y$/, 'ies');
  }

  return str + 's';
}

export function listAllAlternativeWords(str: string): string[] {
  return [toSingular(str), toPlural(str)];
}

export interface GlobalVars extends Window {
  rootPath?: string;
}

export function resolvePath(path: string): string {
  const rootPath = (window as GlobalVars).rootPath ?? '';

  if (path.startsWith('/')) {
    return `${rootPath}${path}`;
  }

  return `${rootPath}/${path}`;
}

export const rp = resolvePath;
