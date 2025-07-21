import axios from './index'

export const signIn = (data : {username:string;password:string}) => axios.post(`/signin`,data);
export const signUp = (data : {username:string;password:string}) => axios.post(`/signup`,data);