export interface TsSsgTabsApi {
  refresh(target?: string): void
}

export interface TsSsgModalApi {
  refresh(target?: string): void
  open(id: string, trigger?: HTMLElement | null): void
  close(id: string): void
}

export interface TsSsgMenusApi {
  close(source?: Event | Element): void
  closeAll(): void
  refresh(source?: Event | Element): void
}

export interface TsSsgNavMenuApi {
  hydrate(root?: Element | null): void
}

export interface TsSsgPageTocApi {
  hydrate(root?: Element | null): void
}

declare global {
  interface Window {
    tsSsgTabs?: TsSsgTabsApi
    tsSsgModal?: TsSsgModalApi
    tsSsgMenus?: TsSsgMenusApi
    tsSsgNavMenu?: TsSsgNavMenuApi
    tsSsgPageToc?: TsSsgPageTocApi
  }
}
