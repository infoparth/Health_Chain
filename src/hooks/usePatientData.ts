import { useReadContract, useActiveAccount } from "thirdweb/react";
import { Contract } from "@/constants/Contract";

export interface Document {
  documentId: bigint;
  documentURI: string;
  timestamp: bigint;
  isMinted: boolean;
  tokenId: bigint;
}

export interface PatientStats {
  totalDocuments: number;
  authorizedDoctors: number;
  nftsMinted: number;
}

export interface UsePatientDataReturn {
  documents: readonly Document[] | undefined;
  doctors: readonly string[] | undefined;
  stats: PatientStats;
  isLoading: boolean;
  refetchDocuments: () => void;
  refetchDoctors: () => void;
}

/**
 * Custom hook to fetch all patient data in one place
 * This centralizes data fetching and prevents redundant contract calls
 * Only fetches when wallet is connected to avoid unnecessary calls
 */
export function usePatientData(): UsePatientDataReturn {
  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";
  const isWalletConnected = !!walletAddress;

  // Fetch patient documents - only when wallet is connected
  const { 
    data: documents, 
    isLoading: documentsLoading,
    refetch: refetchDocuments,
    error: documentsError
  } = useReadContract({
    contract: Contract,
    method: "getPatientDocuments",
    params: [walletAddress as `0x${string}`],
    queryOptions: {
      enabled: isWalletConnected, // Only fetch when wallet is connected
    }
  });

  // Fetch authorized doctors - only when wallet is connected
  const { 
    data: doctors, 
    isLoading: doctorsLoading,
    refetch: refetchDoctors,
    error: doctorsError
  } = useReadContract({
    contract: Contract,
    method: "getMyDoctors",
    params: [walletAddress as `0x${string}`],
    queryOptions: {
      enabled: isWalletConnected, // Only fetch when wallet is connected
    }
  });

  // Calculate statistics with error handling
  const stats: PatientStats = {
    totalDocuments: documents?.length || 0,
    authorizedDoctors: doctors?.length || 0,
    nftsMinted: documents?.filter(doc => doc.isMinted).length || 0,
  };

  return {
    documents,
    doctors,
    stats,
    isLoading: documentsLoading || doctorsLoading,
    refetchDocuments,
    refetchDoctors,
  };
}
