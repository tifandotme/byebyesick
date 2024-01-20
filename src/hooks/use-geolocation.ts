import { useEffect, useState } from "react"

interface Location {
  latitude: number | null
  longitude: number | null
}

const useGeolocation = (): {
  location: Location
  locationError: string | null
} => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  })
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleSuccess = (position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  const handleError = (error: GeolocationPositionError) => {
    setLocationError(error.message)
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
    }
  }, [])

  return { location, locationError }
}

export default useGeolocation
