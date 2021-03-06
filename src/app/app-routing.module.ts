import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/home/home.component';
import { PostComponent} from './components/post/post.component';
import { LoginComponent} from './components/login/login.component';
import { NewbookComponent } from './components/newbook/newbook.component';

import { PostsComponent} from './components/posts/posts.component';
import { BookslistComponent } from './components/bookslist/bookslist.component';
import { BookdetailComponent } from './components/bookdetail/bookdetail.component';

const routes: Routes = [
  {path: '', component: BookslistComponent},
  {path: 'posts', component: PostsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'bookslist', component: BookslistComponent},
  {path: 'bookdetail/:id', component: BookdetailComponent},
  {path: 'post/:id', component: PostComponent},
  {path: 'newbook', component: NewbookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
