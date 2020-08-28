import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {

  }

  onSubmit() {
    this.authService.login(this.email, this.password)
      .then(res => {
        // this.flashMessagesService.show('You are now logged in', {
        //   cssClass: 'alert-success', timeout: 2000
        // });
        console.log(res);
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.flashMessagesService.show(err.message, {
          cssClass: 'alert-danger', timeout: 2000
        });
        console.log(err);
      });
  }
}
