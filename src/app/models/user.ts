
export interface User{
  firstName: string,
  lastName: string,
  email: string;
  image?:string,
  isActive?: boolean,
  balance?:number,
  registered?:any,
  hide?: boolean
}