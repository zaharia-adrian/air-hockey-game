import { Link, useNavigate } from "react-router";
import { useUser } from "../../context/user.context";
import { logout } from "../../services/auth.service";

import './Header.scss';

export const Header = () =>{
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    const handleLogOut = () =>{
        logout();
        navigate('/');
        setUser(null);
    }
    return (
        <nav>
            <div className='left'>
                <Link to='/'><h1>Air Hockey Game</h1></Link>
            </div>
            <div className="right">
                {user && <p className="username">{user.username}</p>}
                {(!user) && (
                    <>
                        <Link to='/signup'>Sign Up</Link>
                        <Link to='/signin'>Sign In</Link>
                    </>
                )}
                {(user) && (
                    <button onClick = {handleLogOut}>Log out</button>
                )}
            </div>
        </nav>
    );
}