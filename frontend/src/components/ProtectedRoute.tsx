import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) {
  const userStr = localStorage.getItem('app_user');
  if (!userStr) {
    return <Navigate to="/" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
