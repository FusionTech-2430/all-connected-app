export interface Products {
    id: number;
    idBusiness: string;
    name: string;
    description: string;
    photoUrl: string;
    stock: number;
    price: number;
    status: string;
    labels: string[];
}

export interface ProductsReport {
    category: string;
    productId: number;
    reason: string;
    description: string;
    reportDate: Date;
}