import { Routes, Route } from "react-router-dom";
import Hall from "../pages/Hall/Hall"
import Party from "../pages/Party/Party";
import Schedule from "../pages/Schedule/Schedule";
import Food from "../pages/Food/Food";
import Service from "../pages/Service/Service";
import Bill from "../pages/Bill/Bill";
import Report from "../pages/Report/Report";
import AccountApproval from "../pages/Admin/AccountApproval";


import Login from "../pages/Login/Login.tsx"
import Register from "../pages/Login/Register.tsx"
import PartyBooking from "../pages/PartyBooking/PartyBooking.tsx";
import { ProtectedRoute } from "../auth/ProtectedRoute.tsx";
import { useAuth } from "../auth/AuthContext.tsx";
import { Navigate } from "react-router-dom";

export default function AppRoutes() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route
        path="/dat-tiec"
        element={
          <ProtectedRoute allow="NhanVien">
            <PartyBooking />
          </ProtectedRoute>
        }
      />

      <Route path="/dat-tiec" element={<PartyBooking />} />
      <Route path="/sanh-tiec" element={<Hall />} />
      <Route path="/tiec-cuoi" element={<Party />} />
      <Route path="/lich-su-kien/:view" element={<Schedule />} />
      <Route path="/mon-an" element={<Food />} />
      <Route path="/dich-vu" element={<Service />} />
      <Route path="/hoa-don" element={<Bill />} />

      <Route
        path="/bao-cao"
        element={
          <ProtectedRoute allow="Admin">
            <Report />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/tai-khoan"
        element={
          <ProtectedRoute allow="Admin">
            <AccountApproval />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          role
            ? role == 'NhanVien' ? <Navigate to="/sanh-tiec" replace />
              : <Navigate to="/tai-khoan" replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}
