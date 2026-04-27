/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MobileApp } from './pages/MobileApp';
import { AdminApp } from './pages/AdminApp';
import { Login } from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<MobileApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
