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

interface SocialLinks {
  linkedin: string;
  facebook: string;
  youtube: string;
  instagram: string;
}

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
  generalSettingsForm!: FormGroup;
  profileForm!: FormGroup;
  coursePolicyForm!: FormGroup;
  customizationForm!: FormGroup;
  originalValues: { [key: string]: any } = {};
  isEditingPhoto = false;

  profilePictureControl = new FormControl('', [
    Validators.required,
    Validators.pattern('https?://.+'),
  ]);
  primaryColorText = new FormControl('#892de1');

  currentUser: Iuser | null = null;
  adminUsers: Iuser[] = [];
  editFields: { [key: string]: boolean } = {
    profile_picture: false,
    first_name: false,
    last_name: false,
    gender: false,
    bio: false,
    'links.linkedin': false,
    'links.facebook': false,
    'links.youtube': false,
    'links.instagram': false,
    password: false,
  };
  showPassword = false;
  newAdminEmail = '';
  formSubmitting = false;

  private destroy$ = new Subject<void>();
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  private firestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  private initializeForms() {
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
      role: [{ value: '', disabled: true }],
      password: ['', Validators.required],
      gender: [{ value: '', disabled: true }],
      bio: [{ value: '', disabled: true }],
      created_at: [{ value: '', disabled: true }],
      profile_picture: this.profilePictureControl,      links: this.fb.group({
        linkedin: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
        facebook: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
        youtube: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
        instagram: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
      }),
    });

    this.coursePolicyForm = this.fb.group({
      reviewProcess: ['automatic', Validators.required],
      minDuration: [1, [Validators.required, Validators.min(0)]],
      maxPrice: [1000, [Validators.required, Validators.min(0)]],
      requireCaption: [true],
    });

    this.customizationForm = this.fb.group({
      platformName: ['Udemy Dashboard', Validators.required],
      primaryColor: ['#892de1', Validators.required],
      footerText: ['© 2025 Udemy Dashboard. All rights reserved.'],
      customCSS: [''],
    });

    // Sync color inputs
    this.primaryColorText.valueChanges.subscribe((value) => {
      if (value && value.match(/^#[0-9A-Fa-f]{6}$/)) {
        this.customizationForm.get('primaryColor')?.setValue(value);
      }
    });

    this.customizationForm
      .get('primaryColor')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.primaryColorText.setValue(value);
        }
      });
  }

  ngOnInit() {
    this.loadAdminUsers();
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return;

    try {
      const localUser = JSON.parse(currentUserStr);
      // Set initial state from localStorage
      this.currentUser = localUser;
      this.updateFormWithUserData(localUser);

      // Then fetch fresh data from Firestore
      this.userService
        .getUserByEmail(localUser.email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (firestoreUser) => {
            if (firestoreUser) {
              // Update both states with fresh data
              this.currentUser = firestoreUser;
              this.updateFormWithUserData(firestoreUser);
              // Keep localStorage in sync
              localStorage.setItem(
                'currentUser',
                JSON.stringify(firestoreUser)
              );
            }
          },
          error: (error) => {
            console.error('Error fetching user from Firestore:', error);
          },
        });
    } catch (e) {
      console.error('Error parsing current user:', e);
    }
  }

  private updateFormWithUserData(user: Iuser) {
    this.profileForm.patchValue({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      role: user.role || '',
      gender: user.gender || '',
      bio: user.bio || '',
      created_at: user.created_at || new Date(),
      profile_picture: user.profile_picture || '',
      links: user.links || {
        linkedin: '',
        facebook: '',
        youtube: '',
        instagram: '',
      },
    });
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

  private getFormControl(field: string) {
    if (field.includes('.')) {
      const [group, key] = field.split('.');
      return (this.profileForm.get(group) as FormGroup)?.get(key);
    }
    return this.profileForm.get(field);
  }

  private getFieldValue(field: string): string {
    if (!this.currentUser) return '';

    if (field.includes('.')) {
      const [group, key] = field.split('.');
      if (group === 'links' && key in (this.currentUser.links || {})) {
        return this.currentUser.links?.[key as keyof SocialLinks] || '';
      }
      return '';
    }

    const validKeys: Array<keyof Iuser> = [
      'first_name',
      'last_name',
      'email',
      'gender',
      'bio',
      'profile_picture',
    ];
    if (validKeys.includes(field as keyof Iuser)) {
      return this.currentUser[field as keyof Iuser]?.toString() || '';
    }
    return '';
  }
  toggleEdit(field: string) {
    if (field === 'profile_picture') {
      this.isEditingPhoto = !this.isEditingPhoto;
      if (this.isEditingPhoto) {
        this.profilePictureControl.enable();
        this.profilePictureControl.setValue(
          this.currentUser?.profile_picture || ''
        );
      } else {
        this.cancelEdit(field);
      }
      return;
    }

    // For social media links and other fields
    const control = this.getFormControl(field);
    if (!control) return;

    if (!this.editFields[field]) {
      // Starting edit mode
      this.editFields[field] = true;
      control.enable();
      // Store original value
      this.originalValues[field] = this.getFieldValue(field);
    } else {
      // Cancelling edit mode
      this.cancelEdit(field);
    }
  }

  cancelEdit(field: string) {
    const control = this.getFormControl(field);
    if (!control) return;

    // Revert to original value
    if (field === 'profile_picture') {
      this.isEditingPhoto = false;
      this.profilePictureControl.setValue(
        this.currentUser?.profile_picture || ''
      );
      this.profilePictureControl.disable();
    } else {
      this.editFields[field] = false;
      control.setValue(this.originalValues[field] || '');
      control.disable();
    }
  }
  saveEdit(field: string) {
    const control = this.getFormControl(field);
    if (!control || !control.valid) {
      control?.markAsTouched();
      return;
    }

    const value = control.value;
    let updates: Partial<Iuser> = {};

    if (field === 'profile_picture') {
      if (this.validateUrl(value)) {
        updates = { profile_picture: value };
        this.isEditingPhoto = false;
      } else {
        control.setErrors({ invalidUrl: true });
        return;
      }
    } else if (field.includes('.')) {
      const [group, key] = field.split('.');
      if (group === 'links' && this.currentUser?.links) {
        const validSocialKeys: Array<keyof SocialLinks> = [
          'linkedin',
          'facebook',
          'youtube',
          'instagram',
        ];
        if (validSocialKeys.includes(key as keyof SocialLinks)) {
          if (this.validateSocialMediaUrl(value, key)) {
            updates = {
              links: {
                ...this.currentUser.links,
                [key]: value,
              },
            };
          } else {
            control.setErrors({ invalidUrl: true });
            return;
          }
        }
      }
    } else {
      const validKeys: Array<keyof Iuser> = [
        'first_name',
        'last_name',
        'email',
        'gender',
        'bio',
      ];
      if (validKeys.includes(field as keyof Iuser)) {
        updates = { [field]: value };
      }
    }

    if (Object.keys(updates).length > 0) {
      this.formSubmitting = true;
      this.updateUserInfo(updates);

      // Reset edit state and form control
      Promise.resolve().then(() => {
        this.editFields[field] = false;
        control.disable();
        this.formSubmitting = false;
      });
    }
  }

  private validateUrl(url: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  saveGeneralSettings() {
    if (this.generalSettingsForm.valid) {
      console.log('General settings saved:', this.generalSettingsForm.value);
    }
  }

  saveCoursePolicies() {
    if (this.coursePolicyForm.valid) {
      console.log('Course policies saved:', this.coursePolicyForm.value);
    }
  }

  saveCustomization() {
    if (this.customizationForm.valid) {
      console.log('Customization saved:', this.customizationForm.value);
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
      links: {
        linkedin: '',
        facebook: '',
        youtube: '',
        instagram: '',
      },
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

  private validateSocialMediaUrl(url: string, platform: string): boolean {
    if (!url) return true; // Allow empty values

    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) return false;

    // Platform-specific validation
    switch (platform) {
      case 'linkedin':
        return url.toLowerCase().includes('linkedin.com');
      case 'facebook':
        return url.toLowerCase().includes('facebook.com');
      case 'youtube':
        return url.toLowerCase().includes('youtube.com');
      case 'instagram':
        return url.toLowerCase().includes('instagram.com');
      default:
        return true;
    }
  }

  // Helper method to update a field
  updateField(field: string) {
    const control = this.getFormControl(field);
    if (!control || !control.valid) {
      control?.markAsTouched();
      return;
    }

    const value = control.value;
    let updates: Partial<Iuser> = {};

    // Handle different field types
    if (field === 'profile_picture') {
      updates = { profile_picture: value };
      this.isEditingPhoto = false;
    } else if (field.includes('.')) {
      const [group, key] = field.split('.');
      if (group === 'links' && this.currentUser?.links) {
        const newLinks = {
          ...this.currentUser.links,
          [key]: value,
        };
        // Validate social media URL
        if (this.validateSocialMediaUrl(value, key)) {
          updates = { links: newLinks };
        } else {
          control?.setErrors({ invalidUrl: true });
          return;
        }
      }
    } else {
      updates = { [field]: value };
    }

    // Disable the form control while updating
    control.disable();

    // Update user info with loading state
    this.formSubmitting = true;
    this.updateUserInfo(updates);

    // Re-enable the form control and reset edit state after update
    Promise.resolve().then(() => {
      this.editFields[field] = false;
      this.formSubmitting = false;
    });
  }

  // Helper method to save fields
  saveField(field: string) {
    const control = this.getFormControl(field);
    if (!control || !control.valid) {
      control?.markAsTouched();
      return;
    }

    this.updateField(field);
  }

  // Helper method to save social media links
  private saveSocialMediaLink(platform: keyof SocialLinks, value: string) {
    if (!this.currentUser?.email) return;

    const currentLinks: SocialLinks = {
      linkedin: '',
      facebook: '',
      youtube: '',
      instagram: '',
      ...(this.currentUser.links || {})
    };

    if (this.validateSocialMediaUrl(value, platform)) {
      const newLinks: SocialLinks = {
        ...currentLinks,
        [platform]: value
      };
      
      // Directly update Firestore using the firestore service
      this.firestore
        .collection('users')
        .doc(this.currentUser.email)
        .update({ links: newLinks })
        .then(() => {
          if (this.currentUser) {
            // Update local state and localStorage
            this.currentUser = {
              ...this.currentUser,
              links: newLinks
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            console.log(`${platform} link updated successfully`);

            // Update the form control
            const control = (this.profileForm.get('links') as FormGroup).get(platform);
            if (control) {
              control.setValue(value, { emitEvent: false });
            }
          }
        })
        .catch((error) => {
          console.error(`Error updating ${platform} link:`, error);
          // Revert the form control to its previous value
          const control = (this.profileForm.get('links') as FormGroup).get(platform);
          if (control) {
            control.setValue(currentLinks[platform], { emitEvent: false });
          }
        });
    }
  }

  private updateUserInfo(updates: Partial<Iuser>) {
    if (!this.currentUser?.email) return;

    // Create backup of current state
    const previousState = { ...this.currentUser };

    // For social media links, ensure we merge with existing links
    if (updates.links) {
      updates.links = {
        ...(this.currentUser.links || {}),
        ...updates.links,
      };
    }

    // Optimistically update local state
    this.currentUser = { ...this.currentUser, ...updates };

    // Update Firestore using the users service
    this.userService
      .updateUserByEmail(this.currentUser.email, updates)
      .subscribe({
        next: () => {
          // Update localStorage after successful Firestore update
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          console.log('Profile updated successfully');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          // Revert to previous state on failure
          this.currentUser = previousState;
          localStorage.setItem('currentUser', JSON.stringify(previousState));
          // Update form with previous values
          this.updateFormWithUserData(previousState);
        },
      });
  }

  private updateInFirestore(updates: Partial<Iuser>): Promise<void> {
    if (!this.currentUser?.email) return Promise.reject('No user email found');

    return new Promise((resolve, reject) => {
      this.firestore
        .collection('users')
        .doc(this.currentUser!.email)
        .update(updates)
        .then(() => {
          console.log('Firestore update successful:', updates);
          resolve();
        })
        .catch((error) => {
          console.error('Error updating Firestore:', error);
          // Try to determine the specific error
          let errorMessage = 'Failed to update profile';
          if (error.code === 'permission-denied') {
            errorMessage = 'You do not have permission to update this profile';
          } else if (error.code === 'not-found') {
            errorMessage = 'User profile not found';
          }
          reject(new Error(errorMessage));
        });
    });
  }

  onPhotoLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img.src || img.src === '' || img.naturalWidth === 0) {
      img.src = 'assets/images/default_profile.png';
    }
  }
  onPhotoError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/close-up-shape.svg';
  }
}
