import { Contract, client } from "@/constants/Contract";
import {
  useReadContract,
  useActiveAccount,
  MediaRenderer,
  ConnectButton,
} from "thirdweb/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function View() {
  const [walletFound, setWalletFound] = useState(true);
  const wallet = useActiveAccount();

  const walletAddress = wallet?.address || "";

  console.log("Wallet address: " + walletAddress);

  const { data: document_list } = useReadContract({
    contract: Contract,
    method: "getDocuments",
    params: [walletAddress],
  });

  useEffect(() => {
    const setWallet = () => {
      setWalletFound((prev) => !prev);
    };
    setWallet();
  }, [wallet]);

  if (document_list !== undefined && document_list.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
        {!walletFound && <ConnectButton client={client} />}
        <div className="ViewPage text-center p-4">
          <h4 className="mb-4 text-5xl">List of your records</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {document_list.map((url, index) => (
              <li
                key={index}
                className="border border-gray-400 rounded-md overflow-hidden"
              >
                <MediaRenderer client={client} src={url} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
        {" "}
        <div className="ViewPage">
          <h4>No Documents</h4>
        </div>
      </div>
    );
  }
}
