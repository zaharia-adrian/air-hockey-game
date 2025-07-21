import { FormEvent, useState } from "react";
import { signIn } from "../../services/auth.service";
import { useUser } from "../../context/user.context";
import { useNavigate } from 'react-router'; 
import './AuthForm.scss';


export const SignInForm = () => {
  const [error, setError] = useState<String| null> (null);
  const {user, setUser} = useUser();
  const navigate = useNavigate();
  const signInHandler = async (event: FormEvent<HTMLFormElement>) =>{
    event.preventDefault();
    setError(null);
  
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await signIn(formData);
    if(response.ok){
      setUser(response.user);
      navigate('/');
    }else setError(response.error);
  }

  return (
    <form onSubmit={signInHandler} className="authForm">
      <label> Username:
        <input type="text" name="username" required />
      </label>

      <label> Password:
        <input type="password" name="password" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" > Sign In </button>
    </form>
  );
};
