export interface timestamp{

}


export interface Books 

{
  title: string,
  author: string,
  coverImageUrl: string,
  rating: number,
  genre: string[],
  likeBy: string[],
  numOfLikes: number,
  intro: string,
  reviews: 
}

export interface Books
{
  content: string,
  userId: string,
  userName: string,
  lastUpdateTime: timestamp,
}

export interface User

{
  userEmail: string,
  userName: string,
}