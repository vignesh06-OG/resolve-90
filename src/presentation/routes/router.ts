import { useSyncExternalStore } from "react";

const NAVIGATION_EVENT = "resolve90:navigate";

function subscribe(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  window.addEventListener(NAVIGATION_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(NAVIGATION_EVENT, callback);
  };
}

function getPathname(): string {
  return window.location.pathname;
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname, () => "/");
}

export function navigate(pathname: string): void {
  if (window.location.pathname === pathname) return;
  window.history.pushState(null, "", pathname);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}
