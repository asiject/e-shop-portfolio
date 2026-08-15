import {isMobile} from "react-device-detect";

const LAST_PUBLIC_PATH_KEY = "eshop:lastPublicPath";

function isSafeShopPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/m" || pathname === "/m/") return true;
  if (/^\/category\/[^/]+$/.test(pathname)) return true;
  if (/^\/products\/[^/]+$/.test(pathname)) return true;
  if (/^\/m\/category\/[^/]+$/.test(pathname)) return true;
  if (/^\/m\/products\/[^/]+$/.test(pathname)) return true;
  return false;
}

export function getShopHomePath(): string {
  return isMobile ? "/m" : "/";
}

export function rememberPublicPath(pathname: string): void {
  if (!isSafeShopPath(pathname)) return;
  try {
    sessionStorage.setItem(LAST_PUBLIC_PATH_KEY, pathname === "/m/" ? "/m" : pathname);
  } catch {
    return;
  }
}

function pathFromReferrer(): string | null {
  if (!document.referrer) return null;
  try {
    const url = new URL(document.referrer);
    if (url.origin !== window.location.origin) return null;
    if (!isSafeShopPath(url.pathname)) return null;
    return url.pathname === "/m/" ? "/m" : url.pathname;
  } catch {
    return null;
  }
}

export function getSafeBackPath(): string {
  try {
    const saved = sessionStorage.getItem(LAST_PUBLIC_PATH_KEY);
    if (saved && isSafeShopPath(saved)) return saved;
  } catch {
    // private mode 등
  }
  return pathFromReferrer() ?? getShopHomePath();
}
