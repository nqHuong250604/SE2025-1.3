import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './features/public/Home'
import Login from './features/auth/Login/Login';
import Register from './features/auth/Register/Register';
import ForgotPassword from './features/auth/ForgotPassword/ForgotPassword';
import Dashboard from './features/admin/pages/dashboard/DashBoard';
import ReportsDashboard from './features/admin/pages/reports/ReportsDashboard';
import InventoryDashboard from './features/admin/pages/inventory/InventoryDashboard';
import OrderDashboard from './features/admin/pages/order/OrderDashboard';
import ShipmentDashboard from './features/admin/pages/shipments/ShipmentDashboard';
import CustomerDashboard from './features/admin/pages/customers/CustomerDashboard';
import NotificationDashboard from './features/admin/pages/notifications/NotificationDashboard';
import SettingDashboard from './features/admin/pages/settings/SettingDashboard';
import SupportDashboard from './features/admin/pages/support/SupportDashboard';
import UserManagementDashboard from './features/admin/pages/management/UserManagementDashboard';
import DashboardUser from './features/user/pages/DashboardUser';
import InventoryManagementPage from './features/user/pages/InventoryManagementPage';
import ProfileUser from './features/user/pages/ProfileUser';
import SettingUser from './features/user/pages/SettingUser';
import TransactionPage from './features/user/pages/TransactionPage';
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/forgot_password' element={<ForgotPassword />}></Route>

          <Route path='/user' element={<DashboardUser />}></Route>
          <Route path='/transaction' element={<TransactionPage />}></Route>
          <Route path='/inventory' element={<InventoryManagementPage />}></Route>
          <Route path='/profile' element={<ProfileUser />}></Route>
          <Route path='/settings' element={<SettingUser />}></Route>

          <Route path='/admin' element={<Dashboard />}></Route>
          <Route path='/admin/dashboard' element={<Dashboard />}></Route>
          <Route path='/admin/report' element={<ReportsDashboard />}></Route>
          <Route path='/admin/inventory' element={<InventoryDashboard />}></Route>
          <Route path='/admin/orders' element={<OrderDashboard />}></Route>
          <Route path='/admin/shipments' element={<ShipmentDashboard />}></Route>
          <Route path='/admin/customers' element={<CustomerDashboard />}></Route>
          <Route path='/admin/notifications' element={<NotificationDashboard />}></Route>
          <Route path='/admin/settings' element={<SettingDashboard />}></Route>
          <Route path='/admin/support' element={<SupportDashboard />}></Route>
          <Route path='/admin/users' element={<UserManagementDashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
