import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html'
})
export class CoursesComponent {
  courses = [
    {
      id: '1',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular and build real apps.',
       author: 'Mohamed Ali'
    },
    {
      id: '2',
      title: 'Firebase with Angular',
      description: 'Connect Angular apps with Firebase backend services.',
       author: 'Mohamed Ali'
    },
    {
      id: '3',
      title: 'Tailwind Design System',
      description: 'Design faster using Tailwind’s utility classes.',
       author: 'Mohamed Ali'
    }
  ];

  accept(id: string) {
    console.log(`Accept: ${id}`);
  }

  delete(id: string) {
    console.log(`Delete: ${id}`);
  }

  preview(course: any) {
    console.log('Preview course:', course);
  }
}
