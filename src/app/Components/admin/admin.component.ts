import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Add FormsModule
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  settingsTabs = ['General', 'User Permissions', 'Course Policies', 'Security', 'Customization'];
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

  saveGeneralSettings() {
    console.log('General settings saved:', this.generalSettingsForm.value);
  }

  togglePermission(roleName: string, permissionName: string) {
    console.log(`Toggled permission: ${permissionName} for role: ${roleName}`);
  }

  addAdmin(email: string) {
    console.log(`Added new admin: ${email}`);
  }
}
