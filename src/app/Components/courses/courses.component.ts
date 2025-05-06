import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-courses',
  imports: [CommonModule ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {

  courses = [
    {
      title: 'Angular Mastery',
      instructor: 'John Doe',
      image: 'https://via.placeholder.com/400x200?text=Angular+Course',
    },
    {
      title: 'React Essentials',
      instructor: 'Jane Smith',
      image: 'https://via.placeholder.com/400x200?text=React+Course',
    },
  ];

  accept(course: any) {
    console.log('Accepted:', course);
  }

  preview(course: any) {
    console.log('Previewing:', course);
  }

  delete(course: any) {
    console.log('Deleted:', course);
  }
}
