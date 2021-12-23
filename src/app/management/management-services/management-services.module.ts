import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { ManagementServicesRoutingModule } from './management-services-routing.module';
import { ManagementServicesHomeComponent } from './management-services-home/management-services-home.component';
import { ManagementServiceListComponent } from './management-service-list/management-service-list.component';
import { ManagementServiceFormComponent } from './management-service-form/management-service-form.component';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';
import { MessagesService } from '../../messages/messages.service';

@NgModule({
  declarations: [
    ManagementServicesHomeComponent,
    ManagementServiceListComponent,
    ManagementServiceFormComponent,
    CategoryFormDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ManagementServicesRoutingModule
  ],
  providers: [MessagesService]
})
export class ManagementServicesModule { }
