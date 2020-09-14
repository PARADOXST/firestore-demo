import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';
import { Filter } from '../../models/filter';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bookslist',
  templateUrl: './bookslist.component.html',
  styleUrls: ['./bookslist.component.css']
})
export class BookslistComponent implements OnInit {
  books: Book[];
  watchAllBooksUnsubscribe: any;
  watchFiletedBooksUnsubcribe: any;
  isFetchError: boolean;
  fetchErrorMsg: any;
  userId: string;

  constructor(
    private firestoreService: FirestoreService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.books = [];
    this.isFetchError = false;

    this.authService.getAuth().subscribe(auth => {
      if(auth) {
        this.userId = auth.uid;
        console.log(`login user in bookslist component: ${this.userId}`)
        console.log(auth);
      } else {
        this.userId = null;
      }
    });

    this.watchBooks(this.firestoreService.getQueryAllBooks());
    // this.firestoreService.getAllBooks(this.books);
  }

  onApplyFilter(curFilter: Filter) {
    console.log("BookListComponent gets the filter: ");
    console.log(curFilter);

    this.detachAllListeners();
    this.watchFiletedBooksUnsubcribe = this.watchBooks(
      this.firestoreService.getQueryFiltered(curFilter)
    );
  }

  watchBooks(query) {
    this.watchAllBooksUnsubscribe = 
    query.onSnapshot((snapshot) => {
      this.books = [];
      this.isFetchError = false;
      console.log('Realtime update received for books.');
      // this.flashMessagesService.show('Realtime update received for books.', {
      //   cssClass: 'alert-success', timeout: 10000
      // });
      snapshot.forEach((doc) => {
        var book: Book = doc.data();
        book.id = doc.id;
        book.liked = this.userId ? doc.data().likedBy.includes(this.userId) : false;
        this.books.push(book);
        console.log(book);
      });
    }, err => {
      this.isFetchError = true;
      this.fetchErrorMsg = err.message;
      console.log(err.message);
    });
    console.log('Query sent to firestore');
    // this.flashMessagesService.show('Query sent to firestore', {
    //   cssClass: 'alert-success', timeout: 10000
    // });
  }

  private detachAllListeners() {
    this.watchAllBooksUnsubscribe();
    if(this.watchFiletedBooksUnsubcribe) {
      this.watchFiletedBooksUnsubcribe();
    }
  }

}
