import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Features/Login';

import Dashboard from './Features/Dashboard';

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
);

export default App;
