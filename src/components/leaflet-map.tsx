import React from "react"
import L, { type LatLngLiteral } from "leaflet"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"

interface LeafletMapProps extends React.ComponentProps<typeof MapContainer> {
  coords: LatLngLiteral
  onCoordsChange: (coords: LatLngLiteral) => void
}

export default function LeafletMap({
  coords,
  onCoordsChange,
  ...props
}: LeafletMapProps) {
  const [position, setPosition] = React.useState(coords)

  React.useEffect(() => {
    onCoordsChange(position)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position])

  return (
    <MapContainer center={position} {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        coords={coords}
        position={position}
        setPosition={setPosition}
      />
    </MapContainer>
  )
}

interface LocationMarkerProps {
  coords: LatLngLiteral
  position: LatLngLiteral
  setPosition: (position: LatLngLiteral) => void
}

function LocationMarker({
  coords,
  position,
  setPosition,
}: LocationMarkerProps) {
  const markerRef = React.useRef<any | null>(null)

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [setPosition],
  )

  const map = useMapEvents({
    click() {
      map.flyTo(position, map.getZoom())
    },
  })

  React.useEffect(() => {
    setPosition(coords)
    map.flyTo(coords, map.getZoom())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords])

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
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
