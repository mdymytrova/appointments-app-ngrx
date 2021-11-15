export interface ServiceProvider {
    id?: string;
    contactInfo: ServiceProviderContactInfo;
    services: ServiceProviderService[];
    schedule: DaySchedule[];
    appointments?: any[];
}

export interface ServiceView {
    name: string;
    id: string;
    checked: boolean;
}

export interface ServiceProviderContactInfo {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
export interface DaySchedule {
    available: boolean;
    name: string;
    day: string;
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
}

export interface ServiceProviderService {
    id: string; 
}