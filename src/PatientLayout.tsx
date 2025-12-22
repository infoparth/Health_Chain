import { Outlet } from "react-router-dom";
import { usePatientData } from "./hooks/usePatientData";
import { useAuthRedirect } from "./hooks/useAuthRedirect";

/**
 * PatientLayout - Parent layout for all patient routes
 * Responsibilities:
 * 1. Enforces patient-only access (redirects doctors, unregistered, or disconnected wallets)
 * 2. Calls usePatientData once and shares data with all child routes via context
 * This prevents duplicate contract calls across patient pages
 */
export default function PatientLayout() {
  // Enforce patient-only access
  useAuthRedirect({ allowedRole: "patient" });

  // Fetch patient data once for all child routes
  const patientData = usePatientData();

  return <Outlet context={patientData} />;
}
