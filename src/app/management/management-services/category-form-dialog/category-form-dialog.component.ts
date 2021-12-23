import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ServiceCategoriesApiService } from '../services/service-categories-api.service';

@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss']
})
export class CategoryFormDialogComponent implements OnInit {
  public category = {
    name: ''
  } as ServiceCategory;

  constructor(
    public dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceCategory,
    private serviceCategoriesApiService: ServiceCategoriesApiService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.category = {...this.data};
    }
  }

  public onSave() {
    if (this.category.name) {
      if (this.category.id) {
        this.serviceCategoriesApiService.updateServiceCategory({name: this.category.name}, this.category.id).catch(() => {
          this.messagesService.showMessage('Unable to update service category.');
        });
      } else {
        this.serviceCategoriesApiService.createServiceCategory({name: this.category.name}).catch(() => {
          this.messagesService.showMessage('Unable to create service category.');
        });
      }

      this.dialogRef.close();
    }
  }

}
