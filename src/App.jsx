import './App.css';

import { Routes, Route } from 'react-router-dom';
import ManageClient from './pages/ManageClient';
import ManagePlan from './pages/ManagePlan';
import LoginPage from './pages/LoginPage';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './pages/Dashboard';
import ManageTemplate from './pages/ManageTemplate';
import ManageCustomer from './pages/ManageCustomer';
import SendMessage from './pages/SendMessage';
import Layout from './layouts/Layout';
import NotFound from './pages/NotFound';
import ManageFile from './pages/ManageFile';
import Messenger from './pages/Messenger';
import Chatbots from './pages/Chatbots';
import ChatbotDesign from './pages/ChatbotDesign';
import ProtectedRoute from './components/ProtectedRoute';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import UpdateBookingPage from './pages/UpdateBookingPage';

function App() {
  const { isLoggedIn } = useSelector((state) => state.user)
  console.log("isLoggedIn", isLoggedIn);

  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/update-appointment/:token" element={<UpdateBookingPage />} />
        <Route path="/" element={<Layout />} >
          <Route index element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["ADMIN", "CLIENT"]} >
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/manage-clients" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["ADMIN"]} >
              <ManageClient />
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <ManageTemplate />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/manage-plan" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["ADMIN"]} >
              <ManagePlan />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <ManageCustomer />
            </ProtectedRoute>
          } />
          <Route path="/send-message" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <SendMessage />
            </ProtectedRoute>
          } />
          <Route path="/manage-files" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <ManageFile />
            </ProtectedRoute>
          } />
          <Route path="/messenger" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <Messenger />
            </ProtectedRoute>
          } />
          <Route path="/chatbots" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <Chatbots />
            </ProtectedRoute>
          } />
          <Route path="/chatbot-design/:chatbotId" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} roles={["CLIENT"]} >
              <ChatbotDesign />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
