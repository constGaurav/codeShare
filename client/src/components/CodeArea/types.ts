export interface IUser {
  username: string;
  socketId: string;
}

export interface IJoinedUsers {
  users: IUser[];
  username: string;
  socketId: string;
}
