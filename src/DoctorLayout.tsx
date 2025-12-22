import { Outlet } from "react-router-dom";
import { useAuthRedirect } from "./hooks/useAuthRedirect";

/**
 * DoctorLayout - Parent layout for all doctor routes
 * Enforces that only authenticated doctors can access nested routes
 * Automatically redirects if:
 * - Wallet is disconnected
 * - User is not a doctor (e.g., patient wallet)
 * - User is not registered
 */
export default function DoctorLayout() {
  // Enforce doctor-only access
  useAuthRedirect({ allowedRole: "doctor" });

  return <Outlet />;
}
