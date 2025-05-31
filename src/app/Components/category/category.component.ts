import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import { ICategory } from '../../Models/icategory';
import { CategoryService } from '../../Services/category.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CommonModule,
  ],
  standalone: true,
})
export class CategoryComponent implements OnInit {
  categories: ICategory[] = [];
  loading = false;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while loading categories',
          timer: 3000,
          showConfirmButton: false,
        });
        this.loading = false;
      },
    });
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: ICategory) => {
      if (result) {
        this.categoryService.create(result).subscribe({
          next: (newCategory) => {
            this.categories.push(newCategory);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Category added successfully',
              timer: 2000,
              showConfirmButton: false,
              position: 'top-end',
              toast: true,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while adding the category',
              timer: 3000,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }

  editCategory(category: ICategory): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { mode: 'edit', category },
    });

    dialogRef.afterClosed().subscribe((result: ICategory) => {
      if (result) {
        this.categoryService.update(category.category_id, result).subscribe({
          next: (updatedCategory) => {
            const index = this.categories.findIndex(
              (c) => c.category_id === updatedCategory.id
            );
            if (index !== -1) {
              this.categories[index] = {
                ...updatedCategory,
                category_id: updatedCategory.id,
              };
            }
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Category updated successfully',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while updating the category',
              timer: 3000,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }

  deleteCategory(category: ICategory): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the category permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(category.category_id).subscribe({
          next: () => {
            this.categories = this.categories.filter(
              (c) => c.category_id !== category.category_id
            );
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category deleted successfully',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while deleting the category',
              timer: 3000,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }
}
