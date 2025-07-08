import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from "./routes/AppRoutes.tsx";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import theme from "./theme";
import { AuthProvider, useAuth } from './auth/AuthContext';

function AuthLayout() {
  return (
    <div className="fullScreenContainer">
      <AppRoutes />
    </div>
  );
}

function MainLayout() {
  return (
    <div className="appContainer">
      <Sidebar />
      <main className="content">
        <AppRoutes />
      </main>
    </div>
  );
}

function LayoutWrapper() {
  const { role, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      isInitialized &&                 // đảm bảo auth đã khởi tạo
      !role &&                         // chưa đăng nhập
      location.pathname !== '/login' &&
      !location.pathname.includes('/register')
    ) {
      navigate('/login', { replace: true });
    }
  }, [isInitialized, role, location.pathname, navigate]);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </div>
    );
  }

  return role ? <MainLayout /> : <AuthLayout />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <LayoutWrapper />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;