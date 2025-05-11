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
  profilePictureControl: FormControl = new FormControl('', [
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
  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.generalSettingsForm = this.fb.group({
      siteTitle: ['', Validators.required],
      language: ['', Validators.required],
      theme: ['', Validators.required],
      approvalWorkflow: [''],
      ratingThreshold: [0, [Validators.min(0), Validators.max(5)]],
      twoFactorAuth: [false],
      sessionTimeout: [0, Validators.min(0)],
      seoTitle: [''],
    });

    this.profileForm = this.fb.group({
      first_name: [{ value: '', disabled: true }, Validators.required],
      last_name: [{ value: '', disabled: true }, Validators.required],
      bio: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }, Validators.minLength(8)],
    });
  }

  ngOnInit() {
    this.loadAdminUsers();
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.profileForm.patchValue(user);
        },
        error: (error: Error) => console.error('Error fetching user:', error),
      });
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
        error: (error: Error) =>
          console.error('Error loading admin users:', error),
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

    let value: any;
    if (field === 'profile_picture') {
      if (this.profilePictureControl.invalid) {
        return;
      }
      value = this.profilePictureControl.value;
    } else {
      value = this.profileForm.get(field)?.value;
    }

    this.formSubmitting = true;
    this.userService
      .updateUser(this.currentUser.user_id, { [field]: value })
      .subscribe({
        next: () => {
          if (this.currentUser) {
            this.currentUser = { ...this.currentUser, [field]: value };
          }
          this.toggleEdit(field);
          this.formSubmitting = false;
        },
        error: (error: Error) => {
          console.error('Error updating user:', error);
          this.formSubmitting = false;
        },
      });
  }

  onPhotoLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default_profile.png';
  }

  addAdmin(email: string) {
    if (!email || !email.trim()) return;

    const now = new Date();
    const newAdmin: Partial<Iuser> = {
      email: email.trim(),
      role: 'admin',
      first_name: '',
      last_name: '',
      user_id: email,
      created_at: now,
      password: '',
      gender: '',
      bio: '',
      profile_picture: '',
    };

    this.firestore
      .collection('users')
      .doc(email)
      .set(newAdmin)
      .then(() => {
        this.newAdminEmail = '';
        this.loadAdminUsers();
      })
      .catch((error: Error) => console.error('Error adding admin:', error));
  }

  isFieldEditable(field: string): boolean {
    return [
      'first_name',
      'last_name',
      'password',
      'bio',
      'profile_picture',
    ].includes(field);
  }
}
