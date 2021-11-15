import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private serviceCategoriesApiService: ServiceCategoriesApiService) { }

  ngOnInit(): void {
    if (this.data) {
      this.category = {...this.data};
    }
  }

  public onSave() {
    if (this.category.name) {
      if (this.category.id) {
        this.serviceCategoriesApiService.updateServiceCategory({name: this.category.name}, this.category.id);
      } else {
        this.serviceCategoriesApiService.createServiceCategory({name: this.category.name});
      }

      this.dialogRef.close();
    }
  }

}
