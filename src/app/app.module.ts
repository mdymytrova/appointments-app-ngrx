import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MessagesService } from './messages/messages.service';
import { reducers, metaReducers } from './store/reducers';
import { storeDevModules } from './store-build';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionImmutability: true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot({}),
    storeDevModules,
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
