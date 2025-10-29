'use client';
import { useEffect } from 'react';

interface MapaProps {
  zoomLevel?: number;
}

export const Mapa = ({ zoomLevel = 15.5 }: MapaProps) => {
  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      if (window.google && (window as any).initMap) {
        (window as any).initMap(); // Run callback if already loaded
      }
      return;
    }

    // Define global callback for Google Maps
    (window as any).initMap = function () {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: 38.722110140342515, lng: 1.4594708860911132 }, // Formentera 38.721409067867036, 1.4593396266257508
          zoom: zoomLevel,
          streetViewControl: false,
          mapTypeControl: true,
        }
      );

      new google.maps.Marker({
        position: { lat: 38.722110140342515, lng: 1.4594708860911132 },
        map,
        title: 'Apartamentos Verde Mar',
      });
    };

    // Create script tag for Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_API_KEY_MAP
    }&callback=initMap`; // 👈 solo callback, sin librerías raras
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Only remove script if this component was the one adding it
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any).initMap;
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .map-container {
          width: 100%;
          height: 100%;
        }
      `}</style>

      <div id="map" className="map-container" />
    </>
  );
};
