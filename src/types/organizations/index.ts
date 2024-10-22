export interface Organizations {
    id_organization: string
    name: string
    address: string
    location_lat: number
    location_lng: number
    photo_url: string | null
}

export interface GetOrganizations extends Omit<Organizations, 'id_organization'  | 'address' | 'location_lat' | 'location_lng' | 'photo_url'> {
}