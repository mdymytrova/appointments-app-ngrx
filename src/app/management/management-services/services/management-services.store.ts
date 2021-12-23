import { Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { StoreServiceNew } from '../../../core/services/store-new.service';
import { StoreService } from '../../../core/services/store.service';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ManagementService } from '../../interfaces/service.interface';

export interface IManagementServicesStore {
    services: ManagementService[];
    serviceCategories: ServiceCategory[];
    selectedCategory: ServiceCategory | null;
    selectedCategoryId: string | null;
    selectedService: ManagementService | null;
    selectedServiceId: string | null;
};

@Injectable({
    providedIn: 'root'
})
export class ManagementServicesStore extends StoreServiceNew<IManagementServicesStore> {
    services$ = this.select(state => state.services);
    serviceCategories$ = this.select(state => state.serviceCategories);
    selectedCategoryId = this.select(state => state.selectedCategoryId);
    selectedCategory$ = this.select(state => {
        const found = state.serviceCategories.find(item => item.id === state.selectedCategoryId);
        return found || {id: 'general', name: 'General'};
    }).pipe(map(category => category), first());
    selectedServicesByCategory$ = this.select(state => {
        if (state.selectedCategoryId == 'general') {
            return state.services.filter(item => {
                return item.category == '';
            }) || [];
        } else {
            return state.services.filter(item => {
                return (<ServiceCategory>item?.category).id == state.selectedCategoryId;
            }) || [];
        }
    });
    selectedServiceId$ = this.select(state => state.selectedServiceId);
    selectedService$ = this.select(state => {
        const found = state.services.find(item => item.id === state.selectedServiceId);
        return found || null;
    }).pipe(map(service => service), first());

    constructor() {
        super({
            services: [],
            serviceCategories: [],
            selectedCategory: null,
            selectedCategoryId: null,
            selectedServiceId: null,
            selectedService: null
        });
    }
}