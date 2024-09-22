import { Label } from './Label';

export interface Event {
    id: number;
    labels: Label[]
    // users: User[]
    // business : Business
    name: string;
    description: string;
    photo_url: string;
    capacity: number;
    date: Date;
    active: boolean;
    price: number;
}