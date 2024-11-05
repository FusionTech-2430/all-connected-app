export interface Service {
  id: number;
  idBusiness: string;
  name: string;
  description: string;
  photoUrl: string;
  status: string;
  labels: string[];
}

export interface Labels {
  id: number;
  name: string;
  description: string;
}

export interface ServiceReport {
  category: string;
  serviceId: number;
  reason: string;
  description: string;
  reportDate: Date;
}



