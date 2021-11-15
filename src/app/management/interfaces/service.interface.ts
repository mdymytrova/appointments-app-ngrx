import { ServiceCategory } from './category.interface';

export interface ManagementService {
    id?: string;
    category: ServiceCategory | string;
    name: string;
    description: string;
    duration: ServiceDuration;
}

export interface ServiceDuration {
    hours: string;
    minutes: string;
}