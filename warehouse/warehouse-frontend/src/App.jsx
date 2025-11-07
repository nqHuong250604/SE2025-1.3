import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './components/Home';
import Login from './features/auth/Login/Login';
import ReportsDashboard from './components/ReportsDashboard';
import Register from './features/auth/Register/Register';
import ForgotPassword from './features/auth/ForgotPassword/ForgotPassword';
import Dashboard from './features/admin/pages/DashBoard';
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/forgot_password' element={<ForgotPassword />}></Route>
          <Route path='/admin/report' element={<ReportsDashboard />}></Route>
          <Route path='/admin/dashboard' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
