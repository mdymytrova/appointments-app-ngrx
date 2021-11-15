import { WeekDays } from '../enums';

export interface ScheduleTemplate {
    name: string;
    id: string;
    days?: ScheduleTemplateDayConfig[];
}

export interface ScheduleTemplateDayConfig {
    name: WeekDays;
    appointmentDuration: SheduleTemplateTimeConfig;
    timeSlots?: ScheduleTemplateTimeSlot[];
    workday?: {
        start: string;
        end: string;
    };
}

export interface SheduleTemplateTimeConfig {
    h: number;
    m: number;
}

export interface ScheduleTemplateTimeSlot {
    start: string;
    end: string;
    available: boolean;
}