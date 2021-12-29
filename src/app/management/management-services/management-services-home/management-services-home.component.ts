import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceCategory } from '../../interfaces/category.interface';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { ManagementServiceDataService } from '../store/management-service-data.service';
import { ServiceCategoryEntityService } from '../store/service-category-entity.service';

@Component({
  selector: 'app-management-services-home',
  templateUrl: './management-services-home.component.html',
  styleUrls: ['./management-services-home.component.scss']
})
export class ManagementServicesHomeComponent implements OnInit, OnDestroy {
  serviceCategories$!: Observable<ServiceCategory[]>;
  mobileQuery!: MediaQueryList;
  message$!: Observable<string>;
  private deleteSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceCategoryEntityService: ServiceCategoryEntityService,
    private managementServiceDataService: ManagementServiceDataService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private messagesService: MessagesService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1100px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.serviceCategories$ = this.serviceCategoryEntityService.entities$;
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  private mobileQueryListener: () => void;

  public onAddCategory() {
    this.dialog.open(CategoryFormDialogComponent);
  }

  public onEditCategory(category: ServiceCategory) {
    this.dialog.open(CategoryFormDialogComponent, {data: category});
  }

  public onDeleteCategory(category: ServiceCategory) {
    this.deleteSubscription = this.serviceCategoryEntityService.delete(category).subscribe(
      () => {
        this.managementServiceDataService.deleteCategory(category.id as string);
        this.router.navigate(['categories'], { relativeTo: this.route });
      },
      (error) => {
        this.message$ = of('Unable to delete category.');
      }
    );
  }

}
