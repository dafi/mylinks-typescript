import { Shortcut } from './Shortcut';

const shortcuts: Shortcut[] = [];

export const findShortcuts = (shortcut: string): Shortcut[] => shortcuts.filter(s => s.shortcut.startsWith(shortcut));

export function addShortcut(shortcut: Shortcut): boolean {
  if (shortcuts.find(s => s.shortcut === shortcut.shortcut)) {
    console.error(`Shortcut '${shortcut.shortcut}' already present`);
    return false;
  }
  shortcuts.push(shortcut);
  return true;
}

export function clearShortcuts(): void {
  shortcuts.splice(0);
}
