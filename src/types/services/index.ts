export interface Service {
  id: number;
  id_business: string;
  name: string;
  description: string;
  photoUrl: string;
  state: string;
  labels: string[];
}

export interface Labels {
  id: number;
  name: string;
  description: string;
}

export interface ServiceReport {
  category: string;
  id_service: number;
  reason: string;
  description: string;
  report_date: Date;
}



