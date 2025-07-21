import {useEffect} from 'react';
import {Route, Routes, useNavigate} from 'react-router'
import Cookies from 'js-cookie'
import './App.css';

import { useUser } from './context/user.context';
import { UserStatus } from './types/user.type';

import { Header } from './layout/header/Header';

import { SignInPage } from './pages/auth/signInPage';
import { SignUpPage } from './pages/auth/signUpPage';
import { NotFound } from './pages/not-found/NotFound';
import { GamePage } from './pages/game/GamePage';

function App() {
  const {user, setUser} = useUser();
  const navigate = useNavigate();
  useEffect(()=>{
    const username = Cookies.get('username');  
    if(username){
      setUser({username, status:UserStatus.NEW, id:0});
      navigate('/');
    }
  }, []);

  return (
      <>
        <Header/>
        <Routes>
          {(!user) && (
            <>
              <Route path='signin' element={<SignInPage/>}/>
              <Route path='signup' element={<SignUpPage/>}/>
            </>
          )}
          <Route path='*' element={<GamePage/>}/>
        </Routes>
      </>
  );
}

export default App;
