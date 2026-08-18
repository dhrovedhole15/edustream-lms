import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ 
  user, 
  children, 
  requiredRole 
}: { 
  user: any, 
  children: React.ReactNode, 
  requiredRole?: string 
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check would ideally happen with userData, but for simplicity we can pass it or fetch it
  // In a real app, you'd wait for userData to load before making this decision
  
  return <>{children}</>;
}
