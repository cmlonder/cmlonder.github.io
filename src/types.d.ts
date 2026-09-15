/**
 * @pagefind/default-ui tip bildirimi getirmiyor; kullandığımız yüzey bu kadar.
 */
declare module '@pagefind/default-ui' {
  export interface PagefindUIOptions {
    element: string | HTMLElement;
    showImages?: boolean;
    showSubResults?: boolean;
    excerptLength?: number;
    resetStyles?: boolean;
    translations?: Record<string, string>;
  }
  export class PagefindUI {
    constructor(options: PagefindUIOptions);
    triggerSearch(term: string): void;
    destroy(): void;
  }
}

declare module '@pagefind/default-ui/css/ui.css';
