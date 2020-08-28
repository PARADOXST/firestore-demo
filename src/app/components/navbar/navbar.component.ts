import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  userId: string;
  userEmail: string;

  constructor(
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService
    ) { }

  ngOnInit(): void {
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.isLoggedIn = true;
        this.userId = auth.uid;
        this.userEmail = auth.email;
        console.log(`login user: ${this.userId} ${this.userEmail}`)
      } else {
        this.isLoggedIn = false;
        this.userId = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.flashMessagesService.show('You are logged out now', {
      cssClass: 'alert-success', timeout: 2000
    });
  }
}
