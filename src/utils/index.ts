export { getIconSuggestion, IconSuggestion } from './iconSuggestion';

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatName(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toSingluar(str: string): string {
  if (str.endsWith('ies')) {
    return str.replace(/ies$/, 'y');
  }

  return str.replace(/s$/, '');
}

export function toPlural(str: string): string {
  //is plural?
  if (str.endsWith('s')) {
    return str;
  }

  if (str.endsWith('y')) {
    return str.replace(/y$/, 'ies');
  }

  return str + 's';
}

export function listAllAlternativeWords(str: string): string[] {
  return [toSingluar(str), toPlural(str)];
}
