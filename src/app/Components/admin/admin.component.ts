import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../Services/users.service';
import { AuthService } from '../../Services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Iuser } from '../../Models/iuser/iuser';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  settingsTabs = [
    'General',
    'User Permissions',
    'Course Policies',
    'Security',
    'Customization',
  ];
  activeTab = 0;
  generalSettingsForm: FormGroup;
  profileForm: FormGroup;
  profilePictureControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.*'),
  ]);
  themes = ['Light', 'Dark', 'Blue', 'Green'];
  adminUsers: Iuser[] = [];
  currentUser: Iuser | null = null;
  editFields: { [key: string]: boolean } = {};
  newAdminEmail = '';
  formSubmitting = false;
  private destroy$ = new Subject<void>();
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.generalSettingsForm = this.fb.group({
      siteTitle: ['', Validators.required],
      language: ['English', Validators.required],
      theme: ['Light', Validators.required],
      approvalWorkflow: [''],
      ratingThreshold: [0, [Validators.min(0), Validators.max(5)]],
      twoFactorAuth: [false],
      sessionTimeout: [30, Validators.min(0)],
      seoTitle: [''],
    });

    this.profileForm = this.fb.group({
      first_name: [{ value: '', disabled: true }, Validators.required],
      last_name: [{ value: '', disabled: true }, Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      bio: [{ value: '', disabled: true }],
      profile_picture: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }, Validators.minLength(8)],
    });
  }

  ngOnInit() {
    this.loadAdminUsers();

    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        const user = JSON.parse(currentUserStr);
        this.currentUser = user;

        this.profileForm.patchValue({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          bio: user.bio || '',
          profile_picture: user.profile_picture || '',
        });

        Object.keys(this.profileForm.controls).forEach((key) => {
          this.profileForm.get(key)?.disable();
        });
      } catch (e) {
        console.error('Error parsing current user:', e);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAdminUsers() {
    this.userService
      .getAdmins()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: Iuser[]) => {
          this.adminUsers = users;
        },
        error: (error: Error) => {
          console.error('Error loading admin users:', error);
        },
      });
  }

  saveGeneralSettings() {
    if (this.generalSettingsForm.invalid) {
      this.generalSettingsForm.markAllAsTouched();
      return;
    }
    console.log('Settings saved:', this.generalSettingsForm.value);
  }

  toggleEdit(field: string) {
    if (field === 'profile_picture') {
      this.editFields[field] = !this.editFields[field];
      if (this.editFields[field]) {
        this.profilePictureControl.setValue(
          this.currentUser?.profile_picture || ''
        );
      }
    } else {
      const control = this.profileForm.get(field);
      if (control) {
        if (control.disabled) {
          control.enable();
          this.editFields[field] = true;
        } else {
          control.disable();
          this.editFields[field] = false;
        }
      }
    }
  }

  updateField(field: string) {
    if (!this.currentUser?.user_id || this.formSubmitting) return;

    this.formSubmitting = true;
    let value: any;

    if (field === 'profile_picture') {
      if (this.profilePictureControl.invalid) {
        this.formSubmitting = false;
        return;
      }
      value = this.profilePictureControl.value;
    } else {
      value = this.profileForm.get(field)?.value;
    }

    this.userService
      .updateUser(this.currentUser.user_id, { [field]: value })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.currentUser) {
            this.currentUser = { ...this.currentUser, [field]: value };
            localStorage.setItem(
              'currentUser',
              JSON.stringify(this.currentUser)
            );
          }
          this.toggleEdit(field);
        },
        error: (error) => {
          console.error(`Error updating ${field}:`, error);
        },
        complete: () => {
          this.formSubmitting = false;
        },
      });
  }

  onPhotoLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth === 0) {
      this.profilePictureControl.setErrors({ invalidImage: true });
    }
  }

  addAdmin(email: string) {
    if (!email || !email.trim()) return;
    const newAdmin: Iuser = {
      email: email.trim(),
      user_id: email,
      role: 'admin',
      first_name: '',
      last_name: '',
      password: '',
      gender: '',
      bio: '',
      created_at: new Date(),
      profile_picture: '',
    };

    this.firestore
      .collection('users')
      .doc(email)
      .set(newAdmin)
      .then(() => {
        this.loadAdminUsers();
        this.newAdminEmail = '';
      })
      .catch((error) => {
        console.error('Error adding admin:', error);
      });
  }

  isFieldEditable(field: string): boolean {
    return this.editFields[field] || false;
  }
}
