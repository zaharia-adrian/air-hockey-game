import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { UserProvider } from './context/user.context';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.scss';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <UserProvider>
          <App />
    </UserProvider>
  </BrowserRouter>
);

reportWebVitals();
