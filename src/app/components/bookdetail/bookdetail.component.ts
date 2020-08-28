import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService} from '../../services/firestore.service'
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/review';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookdetailComponent implements OnInit {
  
  book: Book;
  reviews: Review[] = [];
  userId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService) { }

  ngOnInit(): void {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.authService.getAuth().subscribe(auth => {
      console.log("Trying auth");
      if(auth) {
        this.userId = auth.uid;
        this.firestoreService.getBookFromId(id).get().then((doc) => {
        if (doc.exists) {
          var book: Book = doc.data();
          book.id = doc.id;
          book.liked = this.userId ? doc.data().likedBy.includes(this.userId) : false;
          this.book = book;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).then(() => {
          // fetch reviews
          if(this.book) {
            this.firestoreService.getReviewsFromBook(this.book.id).get().then(querySnapshot => {
              querySnapshot.forEach(review => {
                  console.log(review.id, " => ", review.data());
                  var curReview = review.data();
                  curReview.id = review.id;
                  this.reviews.push(curReview);
              });
              console.log(this.reviews);
            });
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });
      } else {
        this.userId = null;
        console.log("User not signed in")
      }
    });
  }

  clickToLike(book: Book) {
    console.log(book);
    // Just rely on firestore watch
    // book.liked = true;
    this.firestoreService.addLikeToBook(book, this.userId);
    this.flashMessagesService.show(`Liked book ${book.title}, waiting for realtime update`, {
      cssClass: 'alert-success', timeout: 2000
    });
    book.liked = true;
    book.numOfLikes += 1;
  }

  clickToDislike(book: Book) {
    console.log(book);
    // Just rely on firestore watch
    // book.liked = false;
    this.firestoreService.removeLikeFromBook(book, this.userId);
    this.flashMessagesService.show(`Disliked book ${book.title}, waiting for realtime update`, {
      cssClass: 'alert-success', timeout: 2000
    });
    book.liked = false;
    book.numOfLikes -= 1;
  }

}
