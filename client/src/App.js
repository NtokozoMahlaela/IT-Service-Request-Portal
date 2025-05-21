import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './Theme';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Tickets from './Pages/Tickets';
import NewTicket from './Pages/NewTicket';
import TicketDetails from './Pages/TicketDetails';
import Layout from './Components/Layout';
import { AuthProvider, useAuth } from './Context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/new" element={<NewTicket />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
