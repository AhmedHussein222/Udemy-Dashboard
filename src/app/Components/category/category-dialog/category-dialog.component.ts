import { Component, Inject } from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA,MatDialogModule,MatDialogRef,} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-category-dialog',
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'add' ? 'Add New Category' : 'Edit Category' }}
    </h2>
    <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="name" required />
          @if (categoryForm.get('name')?.hasError('required')) {
          <mat-error> Category name is required </mat-error>
          }
        </mat-form-field>

       
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="categoryForm.invalid"
        >
          {{ data.mode === 'add' ? 'Add' : 'Save' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }
      mat-dialog-content {
        min-width: 350px;
      }
    `,
  ],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class CategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'add' | 'edit'; category?: any }
  ) {
    this.categoryForm = this.fb.group({
      category_id: [data.category?.id],
      name: [data.category?.name || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const value = this.categoryForm.value;
      value.slug = this.slugify(value.name);
      this.dialogRef.close(value);
    }
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^a-z0-9\-]/g, '') // Remove all non-alphanumeric except -
      .replace(/\-+/g, '-'); // Replace multiple - with single -
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
