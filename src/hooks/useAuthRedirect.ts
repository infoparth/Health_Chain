import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { Contract } from "@/constants/Contract";

type UserRole = "doctor" | "patient" | "unregistered";

interface UseAuthRedirectOptions {
  allowedRole: UserRole;
}

/**
 * useAuthRedirect - Enforces wallet-based role authentication at layout level
 * 
 * Behavior:
 * - No wallet → redirect to /
 * - Wallet connected + role mismatch → redirect to correct dashboard
 * - Wallet connected + unregistered → redirect to /register
 * 
 * This hook performs side effects only (no UI rendering)
 * Mirrors the role resolution logic from Login.tsx
 */
export function useAuthRedirect({ allowedRole }: UseAuthRedirectOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";
  const isRedirecting = useRef(false);

  // Fetch user role from contract - only when wallet is connected
  const { data: userData, isLoading } = useReadContract({
    contract: Contract,
    method: "getUserDetails",
    params: [walletAddress as `0x${string}`],
    queryOptions: {
      enabled: !!walletAddress,
    }
  });

  useEffect(() => {
    // Prevent multiple simultaneous redirects
    if (isRedirecting.current) return;

    // Rule 1: No wallet connected → redirect to home
    if (!walletAddress) {
      isRedirecting.current = true;
      navigate("/", { replace: true });
      setTimeout(() => { isRedirecting.current = false; }, 100);
      return;
    }

    // Wait for role data to load
    if (isLoading) return;

    // Determine user role from contract data
    let userRole: UserRole = "unregistered";
    if (userData) {
      const role = (userData as { role: number }).role;
      if (role === 1) userRole = "doctor";
      else if (role === 2) userRole = "patient";
    }

    // Rule 2: Unregistered user → redirect to registration
    if (userRole === "unregistered") {
      isRedirecting.current = true;
      navigate("/register", { replace: true });
      setTimeout(() => { isRedirecting.current = false; }, 100);
      return;
    }

    // Rule 3: Role mismatch → redirect to correct dashboard
    if (userRole !== allowedRole) {
      isRedirecting.current = true;
      const targetRoute = userRole === "doctor" ? "/doctor" : "/patient";
      navigate(targetRoute, { replace: true });
      setTimeout(() => { isRedirecting.current = false; }, 100);
      return;
    }

    // Rule 4: Correct role and wallet → allow access
    isRedirecting.current = false;
  }, [walletAddress, userData, isLoading, allowedRole, navigate, location.pathname]);

  // Return loading state for optional UI feedback
  return { isLoading, isAuthenticated: !isRedirecting.current };
}
