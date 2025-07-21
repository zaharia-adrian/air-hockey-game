import { SignInForm } from "../../features/auth/SignInForm"
import './AuthPage.scss';
export const SignInPage= () =>{
    return (
        <div className="authPage">
            <h2>Sign In</h2>
            <SignInForm/>
        </div>
    )
}