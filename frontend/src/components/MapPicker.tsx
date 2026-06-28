import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Crosshair, Save, CheckCircle } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  initialPosition?: [number, number];
  onPositionChange: (position: [number, number]) => void;
  onSave?: (position: [number, number]) => void;
  readonly?: boolean;
  showSaveButton?: boolean;
  saving?: boolean;
  saved?: boolean;
}

/** Flies the map to a new position without re-mounting the whole component. */
const FlyToPosition = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  const prevPos = useRef<[number, number] | null>(null);
  useEffect(() => {
    if (position && JSON.stringify(position) !== JSON.stringify(prevPos.current)) {
      map.flyTo(position, 15, { duration: 1.2 });
      prevPos.current = position;
    }
  }, [position, map]);
  return null;
};

const LocationMarker = ({ position, onPositionChange, readonly }: any) => {
  useMapEvents({
    click(e) {
      if (!readonly) {
        onPositionChange([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export const MapPicker: React.FC<MapPickerProps> = ({
  initialPosition,
  onPositionChange,
  onSave,
  readonly = false,
  showSaveButton = false,
  saving = false,
  saved = false,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition?.[0], initialPosition?.[1]]);

  const handlePositionChange = (newPos: [number, number]) => {
    if (!readonly) {
      setPosition(newPos);
      onPositionChange(newPos);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const newPos: [number, number] = [geo.coords.latitude, geo.coords.longitude];
        setPosition(newPos);
        onPositionChange(newPos);
        setGpsLoading(false);
      },
      (err) => {
        setGpsError('Could not get your location. Please allow location access.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const defaultCenter: [number, number] = [23.8103, 90.4125]; // Dhaka default

  return (
    <div className="space-y-2">
      {/* Action Buttons */}
      {!readonly && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 transition-all disabled:opacity-50"
          >
            <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
            {gpsLoading ? 'Locating...' : 'Use Current Location'}
          </button>

          {showSaveButton && onSave && (
            <button
              type="button"
              onClick={() => position && onSave(position)}
              disabled={saving || !position || saved}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 ${
                saved
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-primary-600/20 border border-primary-500/40 text-primary-300 hover:bg-primary-600/30'
              }`}
            >
              {saved ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Saved!</>
              ) : (
                <><Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Location'}</>
              )}
            </button>
          )}

          {position && (
            <span className="text-xs text-slate-500 ml-auto">
              <MapPin className="w-3 h-3 inline mr-1" />
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </span>
          )}
        </div>
      )}

      {gpsError && (
        <p className="text-xs text-red-400">{gpsError}</p>
      )}

      {/* Map */}
      <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', zIndex: 0 }}>
        <MapContainer
          center={position || defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToPosition position={position} />
          <LocationMarker
            position={position || defaultCenter}
            onPositionChange={handlePositionChange}
            readonly={readonly}
          />
        </MapContainer>
      </div>

      {!readonly && !position && (
        <p className="text-xs text-slate-500 text-center">Click on the map or use the button above to set your location.</p>
      )}
    </div>
  );
};
