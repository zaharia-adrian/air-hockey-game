import { FormEvent, useState } from "react";
import { useUser } from "../../context/user.context";
import { signUp } from "../../services/auth.service";
import { useNavigate } from "react-router";
import './AuthForm.scss'


export const SignUpForm = () => {
  const [error, setError] = useState<String | null>(null); 
  const {setUser} = useUser();
  const navigate = useNavigate();
  
  const signUpHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    const formData = new FormData(event.target as HTMLFormElement);
    const result = await signUp(formData);
    if(result.ok){
      setUser(result.user);
      navigate('/');
    }
    else setError(result.error);
  }

  return (
    <form onSubmit={signUpHandler} className="authForm">
      <label> Username:
        <input type="text" name="username" required />
      </label>

      <label> Password:
        <input type="password" name="password" required />
      </label>

      <label> Confirm password:
        <input type="password" name="confirmPassword" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" > Sign Up </button>
    </form>
  );
};
