export interface Theme {
  backgroundImage?: string;
  faviconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  favicon?: string;
  shortcut?: string;
}

export interface Widget {
  id: string;
  title: string;
  list: [Link];
}

export interface Config {
  faviconService?: string;
}

export interface MyLinks {
  theme?: Theme;
  columns: [Widget[]];
  config?: Config;
}

export interface MyLinksLookup {
  findLinksByShortcut(shortcut: string): Link[];
  findWidgetById(widgetId: string): Widget | undefined;
  findWidgetByLinkId(linkId: string): Widget | undefined;
}