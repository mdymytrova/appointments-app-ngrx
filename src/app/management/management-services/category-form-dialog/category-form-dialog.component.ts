import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ServiceCategoryEntityService } from '../store/service-category-entity.service';

@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss']
})
export class CategoryFormDialogComponent implements OnInit, OnDestroy {
  public category = {
    name: ''
  } as ServiceCategory;
  private saveSubscription!: Subscription;
  private mode: string = 'create';

  constructor(
    public dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceCategory,
    private serviceCategoryEntityService: ServiceCategoryEntityService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.category = {...this.data};
      this.mode = 'edit';
    }
  }

  ngOnDestroy(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  public onSave() {
    if (this.category.name) {
      const onSave$ = this.mode === 'edit' ?
        this.serviceCategoryEntityService.update(this.category) :
        this.serviceCategoryEntityService.add(this.category);
      this.saveSubscription = onSave$.subscribe(
        () => {},
        (error) => {}
      );
      this.dialogRef.close();
    }
  }

}
