import { SignUpForm } from "../../features/auth/SignUpForm"
import './AuthPage.scss'
export const SignUpPage= () =>{
    return (
            <div className="authPage">
                <h2>Sign Up</h2>
                <SignUpForm/>
            </div>
        )
}