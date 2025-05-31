import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private snackBar: MatSnackBar,
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
        this.snackBar.open(
          'An error occurred while loading categories',
          'Close',
          {
            duration: 3000,
          }
        );
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
            this.snackBar.open('Category added successfully', 'Close', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open(
              'An error occurred while adding the category',
              'Close',
              {
                duration: 3000,
              }
            );
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
            this.snackBar.open('Category updated successfully', 'Close', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open(
              'An error occurred while updating the category',
              'Close',
              {
                duration: 3000,
              }
            );
          },
        });
      }
    });
  }

  deleteCategory(category: ICategory): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(category.category_id).subscribe({
        next: () => {
          this.categories = this.categories.filter(
            (c) => c.category_id !== category.category_id
          );
          this.snackBar.open('Category deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open(
            'An error occurred while deleting the category',
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }
}
