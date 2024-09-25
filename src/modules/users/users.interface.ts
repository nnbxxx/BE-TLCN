export interface IUser {
  _id: string;
  name: string;
  email: string;
  gender: string;
  age: string;
  address: string;
  role: string;
  // role: {
  //   _id: string;
  //   name: string;
  // };
  // permissions?: {
  //   _id: string;
  //   name: string;
  //   apiPath: string;
  //   module: string;
  // }[];
}
