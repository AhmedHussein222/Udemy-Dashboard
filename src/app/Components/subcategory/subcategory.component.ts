import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from '../../Models/icategory';
import { ISubCategory } from '../../Models/isubcategory';
import { CategoryService } from '../../Services/category.service';
import { SubcategoryService } from '../../Services/subcategory.service';

@Component({
  selector: 'app-subcategory',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './subcategory.component.html',
  styleUrl: './subcategory.component.css',
})
export class SubcategoryComponent implements OnInit {
  categories: ICategory[] = [];
  subcategories: ISubCategory[] = [];
  selectedCategory: ICategory | null = null;
  editingSub: ISubCategory | null = null;
  editName = '';
  loadingSubcategories = false;

  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onCategorySelect(category: ICategory) {
    this.selectedCategory = category;
    this.loadingSubcategories = true;
    this.subcategoryService.getByCategory(category.category_id).subscribe(
      (subs) => {
        this.subcategories = subs;
        this.loadingSubcategories = false;
      },
      () => {
        this.loadingSubcategories = false;
      }
    );
  }

  onCategorySelectById(category_id: string) {
    const category = this.categories.find((c) => c.category_id === category_id);
    if (category) {
      this.onCategorySelect(category);
    } else {
      this.selectedCategory = null;
      this.subcategories = [];
    }
  }

  addSubcategory(name: string) {
    if (!this.selectedCategory) return;
    const slug = this.slugify(name);
    this.subcategoryService
      .create({
        name,
        slug,
        category_id: this.selectedCategory.category_id,
      })
      .subscribe((sub) => {
        this.subcategories.push(sub);
      });
  }

  startEdit(sub: ISubCategory) {
    this.editingSub = sub;
    this.editName = sub.name;
  }

  saveEdit() {
    if (!this.editingSub) return;
    const updated = {
      ...this.editingSub,
      name: this.editName,
      slug: this.slugify(this.editName),
    };
    this.subcategoryService
      .update(this.editingSub.subcategory_id, updated)
      .subscribe({
        next: () => {
          const idx = this.subcategories.findIndex(
            (s) => s.subcategory_id === this.editingSub!.subcategory_id
          );
          if (idx !== -1) this.subcategories[idx] = { ...updated };
          this.editingSub = null;
          this.snackBar.open('Subcategory updated', 'Close', {
            duration: 2000,
          });
        },
        error: () =>
          this.snackBar.open('Error updating subcategory', 'Close', {
            duration: 2000,
          }),
      });
  }

  cancelEdit() {
    this.editingSub = null;
    this.editName = '';
  }

  deleteSub(sub: ISubCategory) {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    this.subcategoryService.delete(sub.subcategory_id).subscribe({
      next: () => {
        this.subcategories = this.subcategories.filter(
          (s) => s.subcategory_id !== sub.subcategory_id
        );
        this.snackBar.open('Subcategory deleted', 'Close', { duration: 2000 });
      },
      error: () =>
        this.snackBar.open('Error deleting subcategory', 'Close', {
          duration: 2000,
        }),
    });
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-');
  }
}
