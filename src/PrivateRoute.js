// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Simulated authentication check
const isAuthenticated = true; // Assume user is not authenticated

export const PrivateRoute = ({ element: Component, ...rest }) => {
  return isAuthenticated ? (
    <Route {...rest} element={<Component {...rest} />} />
  ) : (
    <Navigate to="/login" />
  );
};
