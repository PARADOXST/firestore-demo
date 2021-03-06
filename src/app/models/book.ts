export interface Book {
  id?: string,
  title: string,
  author: string,
  coverImageUrl: string,
  rating: number,
  genre: string[],
  likedBy?: string[],
  // if liked by current user
  liked?: boolean,
  numOfLikes?: number,
  intro: string;
}