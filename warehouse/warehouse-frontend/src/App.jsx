import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/public/Home";
import Login from "./features/auth/Login/Login";
import Register from "./features/auth/Register/Register";
import ForgotPassword from "./features/auth/ForgotPassword/ForgotPassword";
import Dashboard from "./features/admin/pages/dashboard/DashBoard";
import ReportsDashboard from "./features/admin/pages/reports/ReportsDashboard";
import InventoryDashboard from "./features/admin/pages/inventory/InventoryDashboard";
import ShipmentDashboard from "./features/admin/pages/shipments/ShipmentDashboard";
import CustomerDashboard from "./features/admin/pages/customers/CustomerDashboard";
import NotificationDashboard from "./features/admin/pages/notifications/NotificationDashboard";
import SettingDashboard from "./features/admin/pages/settings/SettingDashboard";
import SupportDashboard from "./features/admin/pages/support/SupportDashboard";
import UserManagementDashboard from "./features/admin/pages/management/UserManagementDashboard";
import DashboardUser from "./features/user/pages/DashboardUser";
import InventoryManagementPage from "./features/user/pages/InventoryManagementPage";
import ProfileUser from "./features/user/pages/ProfileUser";
import SettingUser from "./features/user/pages/SettingUser";
import TransactionPage from "./features/user/pages/TransactionPage";
import ProtectedRoute from "./services/ProtectedRoute";
import { AuthProvider } from "./services/AuthContext";
import TransactionDashboard from "./features/admin/pages/transactions/TransactionDashboard";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/forgot_password" element={<ForgotPassword />}></Route>

            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <DashboardUser />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/transaction"
              element={
                <ProtectedRoute>
                  <TransactionPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryManagementPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileUser />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingUser />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/report"
              element={
                <ProtectedRoute>
                  <ReportsDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute>
                  <InventoryDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute>
                  <TransactionDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/shipments"
              element={
                <ProtectedRoute>
                  <ShipmentDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute>
                  <NotificationDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <SettingDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/support"
              element={
                <ProtectedRoute>
                  <SupportDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <UserManagementDashboard />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
