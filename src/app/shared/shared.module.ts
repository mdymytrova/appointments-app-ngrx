import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { LoadingComponent } from '../loading/loading.component';
import { MessagesComponent } from '../messages/messages.component';

@NgModule({
  declarations: [LoadingComponent, MessagesComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [LoadingComponent, MessagesComponent]
})
export class SharedModule { }
