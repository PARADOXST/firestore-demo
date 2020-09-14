import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Filter } from '../../models/filter';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  authorList: string[];
  genreList: string[];
  ratingList: number[];
  curFilter: Filter;
  showFilter: boolean;

  @Output() applyFilterEvent: EventEmitter<Filter> = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    this.authorList = ['George Orwell', 'Ernest Hemingway', 'Charles Dickens', 'John Green', 'Steven King'];
    this.genreList = ['Classics', 'Contemporary', 'Fiction'];
    this.ratingList = [4, 3, 2, 1];
    this.curFilter = {
      author: null,
      rating: null,
      genre: [],
      liked: null,
    }
    this.showFilter = environment.showFilter;
    
  }

  applyFilter() {
    console.log('Apply clicked');
    this.applyFilterEvent.emit(this.curFilter);
  }

  resetFilter(){
    this.curFilter = {
      author: null,
      rating: null,
      genre: [],
      liked: null,
    }
    this.applyFilterEvent.emit(this.curFilter);
  }



}
