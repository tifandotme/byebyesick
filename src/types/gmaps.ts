// GET https://maps.googleapis.com/maps/api/geocode/json?address={address}&region=id&key={key}

export type GMapsResponse = {
  results: Result[]
  status: string
}

export type Result = {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  types: string[]
}

export type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

export type Geometry = {
  bounds: Bounds
  location: Location
  location_type: string
  viewport: Bounds
}

export type Bounds = {
  northeast: Location
  southwest: Location
}

export type Location = {
  lat: number
  lng: number
}
