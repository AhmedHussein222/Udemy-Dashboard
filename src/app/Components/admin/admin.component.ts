import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { UsersService } from '../../Services/users.service'; // Adjust the path as necessary
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture?: string;
  id?: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Add FormsModule
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  settingsTabs = [
    'General',
    'User Permissions',
    'Course Policies',
    'Security',
    'Customization',
  ];
  activeTab = 0;
  generalSettingsForm: FormGroup;
  languages = ['English', 'Spanish', 'French', 'German'];
  roles = [
    {
      name: 'Admin',
      permissions: [
        { name: 'Manage Users', enabled: true },
        { name: 'Manage Courses', enabled: false },
      ],
    },
    {
      name: 'Instructor',
      permissions: [
        { name: 'Create Courses', enabled: true },
        { name: 'View Analytics', enabled: false },
      ],
    },
  ];
  newAdminEmail = '';
  themes = ['Light', 'Dark', 'Blue', 'Green'];

  adminUser = {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    photo: null,
  };

  adminUsers: IUser[] = []; // Property to hold admin users

  private userService = inject(UsersService);
  private firestore: AngularFirestore = inject(AngularFirestore);

  constructor(private fb: FormBuilder) {
    this.generalSettingsForm = this.fb.group({
      siteTitle: [''],
      logo: [null],
      language: [''],
      tos: [''],
      approvalWorkflow: [''],
      ratingThreshold: [0],
      twoFactorAuth: [false],
      sessionTimeout: [0],
      theme: [''],
      seoTitle: [''],
    });
  }

  ngOnInit() {
    this.loadAdminUsers();
  }

  // Fetch all admin users
  loadAdminUsers() {
    try {
      this.firestore
        .collection<IUser>('users', (ref) => ref.where('role', '==', 'admin'))
        .snapshotChanges()
        .subscribe({
          next: (snapshot) => {
            this.adminUsers = snapshot.map((snap) => {
              const data = snap.payload.doc.data() as IUser;
              const id = snap.payload.doc.id;
              return { ...data, id };
            });
          },
          error: (error) => {
            console.error('Error loading admin users:', error);
          },
        });
    } catch (error) {
      console.error('Error in loadAdminUsers:', error);
    }
  }

  saveGeneralSettings() {
    console.log('General settings saved:', this.generalSettingsForm.value);
  }

  togglePermission(roleName: string, permissionName: string) {
    console.log(`Toggled permission: ${permissionName} for role: ${roleName}`);
  }

  addAdmin(email: string) {
    console.log(`Added new admin: ${email}`);
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Photo selected:', file.name);
      this.adminUser.photo = file;
    }
  }

  updateAdminUser() {
    console.log('Updated admin user data:', this.adminUser);
    // Add Firebase update logic here
  }
}
