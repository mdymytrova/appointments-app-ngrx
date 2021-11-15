import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementRoutingModule } from './management-routing.module';
import { MaterialModule } from '../material/material.module';
import { ManagementComponent } from './management.component';

@NgModule({
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ManagementRoutingModule
  ]
})
export class ManagementModule { }
