// types/user.ts
export interface UserCreation {
    fullname: string;
    username: string;
    password: string;
    mail: string;
    photo?: File;
    roles: string[];
  }
  