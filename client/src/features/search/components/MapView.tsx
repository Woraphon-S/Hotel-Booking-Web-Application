'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  properties: any[];
}

const MapView = ({ properties }: MapViewProps) => {
  // Default center of Thailand
  const center: [number, number] = [13.7367, 100.5232];

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-border shadow-inner z-0">
      <MapContainer 
        center={center} 
        zoom={6} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties?.map((property) => {
          // Use real lat/lng when present, else a stable id-derived offset near Bangkok
          const seed = Number(property.id) || 0;
          const position: [number, number] = [
            Number(property.latitude) || 13.7367 + (((seed * 37) % 100) / 100 - 0.5) * 2,
            Number(property.longitude) || 100.5232 + (((seed * 53) % 100) / 100 - 0.5) * 2
          ];

          return (
            <Marker key={property.id} position={position} icon={icon}>
              <Popup className="rounded-lg">
                <div className="p-1 max-w-[200px]">
                  <h4 className="font-bold text-primary mb-1 line-clamp-1">{property.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{property.city}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-secondary">฿{Number(property.min_price).toLocaleString()}</span>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                    >
                      ดูข้อมูล
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
