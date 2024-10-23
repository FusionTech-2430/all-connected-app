export interface Organizations {
    id_organization: string
    name: string
    address: string
    location_lat: number
    location_lng: number
    photo_url: string | null
}

export interface CreateOrganizationData {
    name: string
    address: string
    location_lat: number
    location_lng: number
    photo_url: string | null
}