import React from "react"
import L, { type LatLngLiteral } from "leaflet"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"

import { useDebounce } from "@/hooks/use-debounce"

interface LeafletMapProps extends React.ComponentProps<typeof MapContainer> {
  coords: LatLngLiteral
  onCoordsChange: (coords: LatLngLiteral) => void
}

export default function LeafletMap({
  coords,
  onCoordsChange,
  ...props
}: LeafletMapProps) {
  const debouncedCoords = useDebounce(coords, 500)

  return (
    <MapContainer center={debouncedCoords} {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        coords={debouncedCoords}
        onCoordsChange={onCoordsChange}
      />
    </MapContainer>
  )
}

interface LocationMarkerProps {
  coords: LatLngLiteral
  onCoordsChange: (coords: LatLngLiteral) => void
}

function LocationMarker({ coords, onCoordsChange }: LocationMarkerProps) {
  const markerRef = React.useRef<any | null>(null)

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          onCoordsChange(marker.getLatLng())
        }
      },
    }),
    [onCoordsChange],
  )

  const map = useMapEvents({
    click() {
      map.flyTo(coords, map.getZoom())
    },
  })

  React.useEffect(() => {
    map.flyTo(coords, map.getZoom())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords])

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={coords}
      ref={markerRef}
      icon={L.icon({
        iconUrl: "/images/marker-icon-2x.png",
        shadowUrl: "/images/marker-shadow.png",
        iconSize: [25, 40],
        iconAnchor: [20, 40],
      })}
    />
  )
}
