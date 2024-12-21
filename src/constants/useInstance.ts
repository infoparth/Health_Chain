import { useState, useEffect } from "react";
import {
  ThirdwebClient,
  createThirdwebClient,
  getContract,
  ThirdwebContract,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { abi } from "./recordsabi";
import type { Abi } from "abitype";

const CONTRACT_CONFIG = {
  clientId: "a81b28f71aa45b7499e14d244942b8b2",
  contractAddress: "0xbBe31a7A8c78F7e427ea16770AA611CBCa1747A8" as const,
} as const;

// Create a singleton client instance
export const client: ThirdwebClient = createThirdwebClient({
  clientId: CONTRACT_CONFIG.clientId,
});

// Define the contract type based on your ABI
type ContractType = ThirdwebContract<Abi>;

export const useContract = () => {
  const [contract, setContract] = useState<ContractType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        const contractInstance = getContract({
          client,
          chain: sepolia,
          address: CONTRACT_CONFIG.contractAddress,
          abi,
        });

        setContract(contractInstance);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to initialize contract")
        );
        setContract(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeContract();
  }, []);

  return {
    contract,
    error,
    isLoading,
  };
};
