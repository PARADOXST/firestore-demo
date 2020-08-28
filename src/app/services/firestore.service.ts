import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { Observable, generate } from 'rxjs';
import { RequiredValidator } from '@angular/forms';
// import * as firebase from 'firebase';
import { environment } from '../../environments/environment';
import { Filter } from '../models/filter';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirebaseApp } from '@angular/fire'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  fs: any;
  constructor(private firebase: FirebaseApp) {
    // initialize firebase using firebase SDK
    // an alternative is to use angularfire 
    this.fs = firebase.firestore();
  }
  

  getAllBooks(books: Book[]) {
      this.fs.collection("books").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          books.push(doc.data());
      });
    });
  }
  
  getQueryAllBooks() {
    return this.fs.collection('books').limit(50);
  }

  getQueryFiltered(filter: Filter) {
    var query = this.fs.collection('books');

    if(filter.author) {
      query = query.where("author", "==", filter.author);
    }
    if(filter.rating) {
      query = query.where("rating", ">=", filter.rating);
    }

    if(filter.liked) {
      query = query.where("likedBy", "array-contains", 'Ljmrn4SfTMhKgFN8jb2s')
    }
    if(filter.genre) {
      filter.genre.forEach((ele) => {
        query = query.where(`genre.${ele}`, "==", true);
      })
    }
    console.log(query);
    return query;
  }

  getBookFromId(bookId: string) {
    return this.fs.collection('books').doc(bookId);
  }

  getReviewsFromBook(bookId: string) {
    return this.fs.collection('books').doc(bookId).collection('reviews');
  }

  // why book from booklist can not be bind?
  testWatch(books: Book[]) {
    var query = this.fs.collection('books').limit(50);
    query.onSnapshot((snapshot) => {
      books = [];
      snapshot.forEach((doc) => {
        console.log(doc.data());
        books.push(doc.data());
      });
    });

  }
  
  addLikeToBook(book: Book, userId: string) {
    var bookDocRef = this.fs.collection("books").doc(book.id);
    return this.fs.runTransaction(function(transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(bookDocRef).then(function(bookDoc) {
          if (!bookDoc.exists) {
              throw "Document does not exist!";
          }
  
          // Add userId to likedBy array and likedTotal++
          var newNumOfLikes = bookDoc.data().numOfLikes;
          var newLikedBy = bookDoc.data().likedBy;
          if(!newLikedBy.includes(userId)) {
            newLikedBy.push(userId);
            newNumOfLikes += 1;
          }
          
          transaction.update(bookDocRef, { likedBy: newLikedBy, numOfLikes: newNumOfLikes });
      });
    }).then(function() {
      console.log("Transaction successfully committed!");
    }).catch(function(error) {
      console.log("Transaction failed: ", error);
    });
  }

  removeLikeFromBook(book: Book, userId: string) {
    var bookDocRef = this.fs.collection("books").doc(book.id);
    return this.fs.runTransaction(function(transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(bookDocRef).then(function(bookDoc) {
        if (!bookDoc.exists) {
            throw "Document does not exist!";
        }

        // remove userId to likedBy array and likedTotal--
        var newNumOfLikes = bookDoc.data().numOfLikes;
        var newLikedBy = bookDoc.data().likedBy.filter((item) => {
          if(item !== userId){
                return item;
          } else {
            newNumOfLikes -= 1;
          }
        });
        transaction.update(bookDocRef, { likedBy: newLikedBy, numOfLikes: newNumOfLikes });
      });
    }).then(function() {
      console.log("Transaction successfully committed!");
    }).catch(function(error) {
      console.log("Transaction failed: ", error);
    });
  }

  // A test that returns promise
  returnPromise() {
    return this.fs.collection("books").get();
  }

  // A test that tries compound query()
  testQuery() {
    var db = this.fs;
    db.collection('books').where("author", "==", "George Orwell")
    .where("rating", ">=", 3)
    .where("language", "==", "English")
    .where("genre.Fiction", "==", true)
    .where("genre.Classics", "==", true)
    .where("genre.Contemporary", "==", false)
    //.where("genre.Politics", "==", true)
    .where("genre.Literature", "==", true)
    .where("likedBy", "array-contains", 'Ljmrn4SfTMhKgFN8jb2s')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
    });
  }

}
