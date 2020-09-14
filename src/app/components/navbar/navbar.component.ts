import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FirestoreService } from "../../services/firestore.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: string;
  userEmail: string;

  constructor(
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService,
    private firestoreService: FirestoreService
    ) { }

  ngOnInit(): void {
    // Q: Will the page respond to the initial default value of isAdmin etc.?
    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.isLoggedIn = true;
        this.userId = auth.uid;
        this.userEmail = auth.email;
        this.firestoreService.getUserFromId(this.userId)
        .get()
        .then(doc => {
          console.log(doc.id, " => ", doc.data());
          this.isAdmin = doc.data().role == "admin";
          console.log(`login user: ${this.userId} ${this.userEmail} ${this.isAdmin}`);
        });
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userId = null;
        this.userEmail = null;
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
