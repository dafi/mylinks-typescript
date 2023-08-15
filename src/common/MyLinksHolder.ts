import { filterMyLinks, someMyLinks } from '../model/MyLinks';
import { KeyCombination, LinkId, MyLinks, MyLinksLookup, Widget, WidgetId } from '../model/MyLinks-interface';
import { LinkCache } from './LinkCache.ts';
import { LinkArrayShortcut, LinkShortcut, Shortcut } from './Shortcut.ts';
import { SystemShortcutManager } from './SystemShortcutManager.ts';

export class MyLinksHolder implements MyLinksLookup {
  private mLinkCache?: LinkCache;

  private static setColor(property: string, color?: string): void {
    if (color) {
      document.documentElement.style.setProperty(property, color);
    } else {
      document.documentElement.style.removeProperty(property);
    }
  }

  constructor(public readonly myLinks: MyLinks) {
  }

  get linkCache(): LinkCache {
    if (!this.mLinkCache) {
      this.mLinkCache = new LinkCache(this.myLinks.columns);
    }
    return this.mLinkCache;
  }

  findWidgetByLinkId(linkId: LinkId): Widget | undefined {
    return this.linkCache.find(linkId)?.widget;
  }

  findWidgetById(id: WidgetId): Widget | undefined {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  findShortcuts(shortcut: KeyCombination): Shortcut[] {
    const systemShortcut = SystemShortcutManager.instance().find(shortcut);
    if (systemShortcut.length) {
      return systemShortcut;
    }

    const multiLinks = this.findLinkArray(shortcut);
    if (multiLinks.length) {
      return multiLinks;
    }

    return filterMyLinks(this.myLinks, (_w, l) =>
      l.shortcut?.startsWith(shortcut) === true
    ).map(link => ({
      shortcut: link.shortcut ?? shortcut,
      type: 'link',
      link
    } as LinkShortcut));
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (_w, l) => !!l.shortcut);
  }

  applyBackground(): void {
    const bkg = this.myLinks.theme?.backgroundImage;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme(): void {
    const theme = this.myLinks.theme;

    if (!theme) {
      return;
    }

    MyLinksHolder.setColor('--link-key-background', theme.linkKeyBackground);
    MyLinksHolder.setColor('--link-key-color', theme.linkKeyColor);
  }

  findLinkArray(shortcutPattern: KeyCombination): LinkArrayShortcut[] {
    if (!this.myLinks.multiOpen) {
      return [];
    }
    return Object
      .entries(this.myLinks.multiOpen.shortcuts)
      .filter(([shortcut, _]) => shortcut.startsWith(shortcutPattern))
      .map(([shortcut, idLinks]) => (
        {
          shortcut,
          type: 'linkArray',
          links: idLinks.map(id => this.linkCache.find(id)?.link)
        } as LinkArrayShortcut)
      );
  }
}
