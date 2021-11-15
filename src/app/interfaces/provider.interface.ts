export interface IProvider {
    name: string;
    id: string;
    scheduleTemplates: ProviderScheduleTemplate[]
};

export interface ProviderScheduleTemplate {
    id: string;
    name: string;
    added: boolean;
    validity: ProviderScheduleValidity;
}

export interface ProviderScheduleValidity {
    start: any;
    end: any;
}