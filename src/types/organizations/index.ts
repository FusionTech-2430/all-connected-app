export interface Organizations {
    id_organization: string
    name: string
    address: string
    location_lat: number
    location_lng: number
    photoUrl: string | null
}

export interface CreateOrganizationData {
    name: string
    address: string
    location_lat: number
    location_lng: number
    photoUrl: string | null
}