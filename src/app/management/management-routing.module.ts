import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      { path: 'services',
        loadChildren: () => import('./management-services/management-services.module').then(m => m.ManagementServicesModule)
      },
      { path: 'service-providers',
        loadChildren: () => import('./providers/management-providers.module').then(m => m.ManagementProvidersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
