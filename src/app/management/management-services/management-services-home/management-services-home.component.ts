import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceCategory } from '../../interfaces/category.interface';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { ManagementServicesApiService } from '../services/management-services-api.service';
import { ServiceCategoriesApiService } from '../services/service-categories-api.service';

@Component({
  selector: 'app-management-services-home',
  templateUrl: './management-services-home.component.html',
  styleUrls: ['./management-services-home.component.scss']
})
export class ManagementServicesHomeComponent implements OnInit, OnDestroy {
  serviceCategories$!: Observable<ServiceCategory[]>;
  mobileQuery!: MediaQueryList;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceCategoriesApiService: ServiceCategoriesApiService,
    private managementServicesApiService: ManagementServicesApiService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1100px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.serviceCategories$ = this.serviceCategoriesApiService.serviceCategories$;
  }

  ngOnDestroy() {
    this.serviceCategoriesApiService.setSelectedCategory(null);
  }

  private mobileQueryListener: () => void;

  public onAddCategory() {
    this.dialog.open(CategoryFormDialogComponent);
  }

  public onEditCategory(category: ServiceCategory) {
    this.dialog.open(CategoryFormDialogComponent, {data: category});
  }

  public onDeleteCategory(category: ServiceCategory) {
    this.serviceCategoriesApiService.deleteServiceCategory(category.id as string)
      .then(() => {
        this.managementServicesApiService.deleteServiceCategory(category.id as string);
      });
      this.router.navigate(['categories'], { relativeTo: this.route });
  }

}
