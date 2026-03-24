export {};

declare global {
  interface Window {
    google: typeof google;
    __gmapsLoadingPromise?: Promise<void>;
  }
}