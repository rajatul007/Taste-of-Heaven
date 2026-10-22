import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationState } from '../types';

interface LocationContextType {
  location: LocationState;
  setLocation: (loc: LocationState) => void;
  selectLocality: (locality: string, city: string, address?: string) => void;
  detectLiveGPS: () => Promise<void>;
  isDetectingGPS: boolean;
  gpsError: string | null;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
}

const DEFAULT_LOCATION: LocationState = {
  locality: 'Knowledge Park 2',
  city: 'Greater Noida',
  addressString: 'Institutional Area, Knowledge Park 2, Greater Noida, UP',
  coordinates: { lat: 28.4744, lng: 77.5040 },
  isUsingGPS: false,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>(() => {
    const saved = localStorage.getItem('foodrush_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_LOCATION;
      }
    }
    return DEFAULT_LOCATION;
  });

  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodrush_location', JSON.stringify(location));
  }, [location]);

  const selectLocality = (locality: string, city: string, address?: string) => {
    setLocation({
      locality,
      city,
      addressString: address || `${locality}, ${city}, Uttar Pradesh`,
      isUsingGPS: false,
    });
    setIsLocationModalOpen(false);
  };

  const detectLiveGPS = async (): Promise<void> => {
    setIsDetectingGPS(true);
    setGpsError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setGpsError('Geolocation is not supported by your browser.');
        setIsDetectingGPS(false);
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Approximate reverse-geocoding for NCR / Greater Noida region
          let detectedLocality = 'Alpha 1';
          let detectedCity = 'Greater Noida';
          let detectedAddress = `Current Live GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Greater Noida, UP`;

          // If closer to central Noida
          if (latitude > 28.53 && latitude < 28.60 && longitude < 77.40) {
            detectedLocality = 'Sector 18';
            detectedCity = 'Noida';
            detectedAddress = `Sector 18 Market, Noida, Uttar Pradesh (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          } else if (latitude > 28.58 && longitude < 77.25) {
            detectedLocality = 'Connaught Place';
            detectedCity = 'Delhi';
            detectedAddress = `Central Delhi, New Delhi (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          } else if (latitude < 28.49 && longitude < 77.10) {
            detectedLocality = 'DLF Cyber Hub';
            detectedCity = 'Gurugram';
            detectedAddress = `DLF Phase 2, Gurugram, Haryana (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          } else {
            detectedLocality = 'Alpha 1';
            detectedCity = 'Greater Noida';
            detectedAddress = `Near Alpha 1 Commercial Belt, Greater Noida, UP (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          }

          setLocation({
            locality: detectedLocality,
            city: detectedCity,
            addressString: detectedAddress,
            coordinates: { lat: latitude, lng: longitude },
            isUsingGPS: true,
          });

          setIsDetectingGPS(false);
          setIsLocationModalOpen(false);
          resolve();
        },
        (error) => {
          let msg = 'Unable to retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Please select your locality manually below.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please select your locality below.';
          }
          setGpsError(msg);
          setIsDetectingGPS(false);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        selectLocality,
        detectLiveGPS,
        isDetectingGPS,
        gpsError,
        isLocationModalOpen,
        setIsLocationModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};
