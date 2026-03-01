import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("role");
  if (role != "ADMIN") return <Navigate to="/login" replace />;
  return <>{children}</>
}