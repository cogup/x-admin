export { getIconSuggestion, IconSuggestion } from './iconSuggestion';

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatName(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
