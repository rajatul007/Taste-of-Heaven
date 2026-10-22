import React from 'react';
import { MapPin, Navigation, X, Check, Compass, AlertCircle } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocality?: (locality: string, city: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSelectLocality }) => {
  const { location, selectLocality, detectLiveGPS, isDetectingGPS, gpsError } = useLocation();

  if (!isOpen) return null;

  const popularHubs = [
    {
      group: 'Greater Noida Key Hubs',
      localities: [
        {
          name: 'Knowledge Park 2',
          city: 'Greater Noida',
          tag: 'Appitito Cafe, Institutional Area',
          address: 'Plot 12, Institutional Area, Knowledge Park 2, Greater Noida, UP 201310',
        },
        {
          name: 'Beta 2',
          city: 'Greater Noida',
          tag: 'Barbeque Nation & Burger King @ Omaxe Mall',
          address: 'Sector Beta 2 Commercial Hub, Greater Noida, UP 201308',
        },
        {
          name: 'Alpha 1',
          city: 'Greater Noida',
          tag: 'Nirula’s (Since 1977) & Commercial Complex',
          address: 'Sector Alpha 1 Commercial Complex, Greater Noida, UP 201310',
        },
        {
          name: 'Alpha 2',
          city: 'Greater Noida',
          tag: 'Banzara Bliss Mughlai, Commercial Market',
          address: 'Sector Alpha 2 Commercial Market, Greater Noida, UP 201310',
        },
        {
          name: 'Knowledge Park III',
          city: 'Greater Noida',
          tag: 'Paratha Gali, Sharda & Galgotias Universities',
          address: 'Knowledge Park III University Corridor, Greater Noida, UP 201306',
        },
        {
          name: 'Pari Chowk',
          city: 'Greater Noida',
          tag: 'Bikanervala, The Yellow Chilli, Grand Venice',
          address: 'Pari Chowk Metro Interchange, Greater Noida, UP 201308',
        },
        {
          name: 'Gaur City',
          city: 'Greater Noida',
          tag: 'Berco’s & Gaur City Mall, Noida Extension',
          address: 'Gaur City Mall, Greater Noida West, UP 201009',
        },
      ],
    },
    {
      group: 'Other Delhi NCR Hubs',
      localities: [
        {
          name: 'Sector 18',
          city: 'Noida',
          tag: "Karim's Historic Old Delhi, DLF Mall",
          address: 'Sector 18 Market, Noida, UP 201301',
        },
        {
          name: 'Sector 132',
          city: 'Noida',
          tag: 'Carnatic Cafe, Expressway IT Corridor',
          address: 'Expressway Commercial Zone, Sector 132, Noida, UP 201304',
        },
        {
          name: 'Connaught Place',
          city: 'Delhi',
          tag: 'Moti Mahal Delux (1920), Central Delhi',
          address: 'Inner Circle, Connaught Place, New Delhi 110001',
        },
        {
          name: 'DLF Cyber Hub',
          city: 'Gurugram',
          tag: 'Cyber Hub Social, DLF Phase 2',
          address: 'DLF Cyber Hub, DLF Phase 2, Gurugram, Haryana 122002',
        },
      ],
    },
  ];

  const handleSelect = (name: string, city: string, address: string) => {
    selectLocality(name, city, address);
    if (onSelectLocality) {
      onSelectLocality(name, city);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Select Delivery Location</h3>
              <p className="text-xs text-gray-500">Live GPS or pick your Greater Noida / NCR locality</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Live GPS Detection Button */}
          <button
            onClick={detectLiveGPS}
            disabled={isDetectingGPS}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-orange-500 bg-orange-50 hover:bg-orange-100/80 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Navigation
                  className={`w-5 h-5 ${isDetectingGPS ? 'animate-spin' : ''}`}
                />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-950 flex items-center gap-2">
                  Use Current GPS Location
                  {location.isUsingGPS && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">
                      ACTIVE
                    </span>
                  )}
                </p>
                <p className="text-xs text-orange-800">
                  {isDetectingGPS
                    ? 'Detecting real coordinates from browser GPS...'
                    : 'Get restaurants delivering directly to your exact doorstep'}
                </p>
              </div>
            </div>
          </button>

          {gpsError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Localities Section */}
          {popularHubs.map((section) => (
            <div key={section.group}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {section.group}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {section.localities.map((loc) => {
                  const isSelected =
                    location.locality.toLowerCase() === loc.name.toLowerCase() &&
                    location.city.toLowerCase() === loc.city.toLowerCase();

                  return (
                    <button
                      key={loc.name}
                      onClick={() => handleSelect(loc.name, loc.city, loc.address)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <MapPin
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isSelected ? 'text-orange-600' : 'text-gray-400'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                            {loc.name}
                            <span className="text-[11px] font-normal text-gray-500">
                              ({loc.city})
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 truncate">{loc.tag}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
