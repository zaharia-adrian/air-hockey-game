export enum UserStatus{
    NEW = 0, 
    WAITING,
    PLAYING, 
}

export type User = {
    username: string;
    id:number; 
    status:UserStatus
    roomId?:string
}