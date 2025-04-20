import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../../Services/users.service';
import { Iuser } from '../../Models/iuser/iuser.module';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  private firestore = inject(UsersService);
  users: Observable<Iuser[]>;

  constructor() {
    this.users = this.firestore.getAll('Users');
    console.log(this.users);
  }

   ngOnInit(): void {}

  trackByEmail(index: number, user: any): string {
    return user.email;
  }
}
