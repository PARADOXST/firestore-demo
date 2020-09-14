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
  curReview: string;
  reviewSubscriber : any;

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
        console.log(auth.displayName);
        this.firestoreService.getBookFromId(id).onSnapshot((doc) => {
        if (doc.exists) {
          var book: Book = doc.data();
          book.id = doc.id;
          book.liked = this.userId ? doc.data().likedBy.includes(this.userId) : false;
          this.book = book;

          this.flashMessagesService.show('Realtime update received for current book.', {
            cssClass: 'alert-success', timeout: 3000
          });
          // fetch reviews
          if(!this.reviewSubscriber) {
            this.reviewSubscriber = this.firestoreService.getReviewsFromBook(this.book.id).onSnapshot(querySnapshot => {
              this.reviews = [];
              querySnapshot.forEach(review => {
                  console.log(review.id, " => ", review.data());
                  var curReview = review.data();
                  curReview.id = review.id;
                  this.reviews.push(curReview);
              });
              this.flashMessagesService.show('Realtime update received for book reviews.', {
                cssClass: 'alert-success', timeout: 3000
              });
              console.log(this.reviews);
            });
          }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
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

  addReview() {
    console.log(`send review to firestore: ${this.curReview}`);
    this.firestoreService.getUserFromId(this.userId).get().then((doc) => {
      let review: Review = {id: null, userId: this.userId, content: this.curReview, userName: doc.data().userName};
      this.firestoreService.addReviewToBookRef(review, this.book.id)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        this.curReview = "";
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
          this.curReview = "";
      });
      })
  }

  deleteReview(review: Review) {
    this.firestoreService.deleteReview(review, this.book.id).then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

}
