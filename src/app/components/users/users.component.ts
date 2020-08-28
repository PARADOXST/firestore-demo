import { Component, OnInit, ViewChild, KeyValueDiffers} from '@angular/core';
import { User } from '../../models/user'
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
  }
  users: User[];
  showExtended: boolean = false;
  enableAdd: boolean = false;
  currentClass;
  currentStyles;
  showUserForm: boolean;
  data: any;

  @ViewChild('userForm')form: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
    this.userService.getData().subscribe(data => {
      console.log(data);
    });
    console.log('UsersComponent finishes loading.')
  }

  addUser() {
    this.user.isActive = true;
    this.user.registered = new Date();
    this.user.hide = true;
    this.users.unshift(this.user);
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
    }
  }

  toggerHide(user: User) {
    user.hide = !user.hide;
  }

  onSubmit({value, valid} : {value: User, valid: boolean}) {
    console.log('Submitted')
    if (!valid) {
      console.log('form bad')
    } else {
      value.isActive = true;
      value.hide = true;
      this.userService.addUser(value);
      this.form.reset()
    }
  }

  fireEvent(e) {
    console.log(e.type);
    console.log(e.target.value);
  }
}
