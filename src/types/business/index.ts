import { UUID } from "crypto"

export interface Business {
    id_business: string
    name: string
    organizations: UUID[]
    owner_id: string
    logo_url: string | null
}

export interface CreateBusinessData {
    name: string;
    owner_id: string;
    logo_url: string;
    organization: string;
}

export interface CreateBusiness extends Omit<Business, 'id_business'  | 'organizations'> {
    organization: UUID
}