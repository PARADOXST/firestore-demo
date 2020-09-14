import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { Title } from '@angular/platform-browser';
import { BookslistComponent } from '../bookslist/bookslist.component';
import { FirestoreService } from "../../services/firestore.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-newbook',
  templateUrl: './newbook.component.html',
  styleUrls: ['./newbook.component.css']
})
export class NewbookComponent implements OnInit {
  curBook: Book;
  isClassic: boolean;
  isContemporary: boolean;
  isFiction: boolean;

  constructor(private firestoreService: FirestoreService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.curBook = {
      title: null,
      author: null,
      coverImageUrl: null,
      genre: null,
      rating: null,
      intro: null,
      likedBy: [],
      numOfLikes: 0,
    }
    this.isClassic = false;
    this.isContemporary = false;
    this.isFiction = false;

  }

  addNewBook = function () {
    this.curBook.genre = {
      Classics: this.isClassic,
      Contemporary: this.isContemporary,
      Fiction: this.isFiction
    };
    console.log(this.curBook);
    this.firestoreService.addNewBook(this.curBook);
    this.router.navigate(['/']);
  }

}
