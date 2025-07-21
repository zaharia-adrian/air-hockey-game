import * as api from '../api/auth.api'
import Cookies from 'js-cookie';
import { UserStatus } from '../types/user.type';
import { User } from '../types/user.type';

type AuthResult = { ok: true; user: User } | { ok: false; error: string };

export const signUp = async (formData: FormData): Promise<AuthResult> => {
    try {
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword');

        if (password !== confirmPassword)
            return { ok: false, error: "The password confirmation does not match" };

        const response = await api.signUp({ username, password });
        return { ok: true, user: { username, id: response.data.user, status: UserStatus.NEW } };

    }catch(err:any){
        const error = err.response?.data?.error;
        return {ok:false, error: error?error:'Unknown error occured!'};
    }

};

export const signIn = async (formData:FormData) : Promise<AuthResult> =>{
    try{
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const response = await api.signIn({ username, password });
        return { ok: true, user: { username, id: response.data.user, status: UserStatus.NEW } };
    }catch(err:any){
        const error = err.response?.data?.error;
        return {ok:false, error: error?error:'Unknown error occured!'};
    }
};

export const logout = () => {
    Cookies.remove('username');
    Cookies.remove('jwt');
}