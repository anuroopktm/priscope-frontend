const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }
  if ((window as any).__gmapsLoadingPromise)
    return (window as any).__gmapsLoadingPromise;

  (window as any).__gmapsLoadingPromise = new Promise<void>(
    (resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    },
  );

  return (window as any).__gmapsLoadingPromise;
}
