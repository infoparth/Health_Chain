import { useState } from "react";
import { Contract, client } from "@/constants/Contract";
import {
  useActiveAccount,
  useReadContract,
  MediaRenderer,
} from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { upload } from "thirdweb/storage";

export default function NFT() {
  const [selectedRecord, setSelectedRecord] = useState<string>(); //TELLS WHICH FILE IS SELECTED
  const [mintAddress, setMintAddress] = useState<string>(); ///THE MINT ADDRESS
  const [useLoggedInAddress, setUseLoggedInAddress] = useState(false); //SAME AS ABOVE
  const [transactionReciept, setTransactionReciept] = useState("");
  const [transactionSent, setTransactionSent] = useState(false);

  const wallet = useActiveAccount();

  const walletAddress = wallet?.address || "";

  console.log("The Wallet Address is: " + walletAddress);

  const { data: record_list } = useReadContract({
    contract: Contract,
    method: "getDocuments",
    params: [walletAddress],
  });

  console.log("Calling the function here:", record_list);

  const callContractFunction = async () => {
    if (mintAddress && selectedRecord) {
      try {
        const transaction = prepareContractCall({
          contract: Contract,
          method: "safeMint",
          params: [mintAddress, selectedRecord],
        });

        console.log("The transaction is", transaction);

        if (transaction !== undefined && wallet) {
          const _transactionReceipt = await sendAndConfirmTransaction({
            account: wallet,
            transaction: transaction,
          });

          console.log("The Transaction Reciept is: ", _transactionReceipt);
          setTransactionReciept(_transactionReceipt.transactionHash);
          setTransactionSent(false);

          return _transactionReceipt.transactionHash;
        }
      } catch (err) {
        setTransactionSent(false);
        console.log("Error is:", err);
      }
    } else {
      console.log("Can't find the mint address and selected record");
    }
  };

  //ACTUAL FUCNTION TO TURN NFT

  const handleWriteData = async () => {
    setTransactionSent(true);
    const _cid = selectedRecord;

    //SET NFT METADATA

    const nftMetadata = {
      name: "Medical Records",
      description: "This NFT denotes your medical records",
      image: _cid, // Replace with the actual IPFS CID of your NFT image
    };

    const metadataJSON = JSON.stringify(nftMetadata);

    await uploadMetadataToIPFS(metadataJSON); //uploading to ipfs

    const confirmed = window.confirm(
      "Are you sure you want to turn it into NFT?"
    );

    if (confirmed) {
      const res = await callContractFunction();
      console.log("confirmed", res);
    } else {
      setTransactionSent(false);
      console.log("Not confirmed");
    }
  };

  //THE ACTUAL FUNCTION

  const uploadMetadataToIPFS = async (metadataJSON: string) => {
    const uri = await upload({
      client,
      files: [metadataJSON],
    });

    console.log("The URI is", uri);
  };

  //REMAINING FUCNCTIONS

  const handleDocumentClick = (url: string) => {
    setSelectedRecord(url);
  };

  const handleRecordChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecord(event.target.value);
  };

  if (record_list !== undefined && record_list.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          {record_list.length > 0 ? (
            <div>
              <h4 className="mb-4 text-4xl">List of your records</h4>
              <div className="flex flex-wrap justify-center mb-4">
                {record_list.map((url, index) => (
                  <div
                    key={index}
                    className={`m-2 ${
                      url === selectedRecord ? "border border-blue-500" : ""
                    }`}
                  >
                    <li
                      onClick={() => handleDocumentClick(url)}
                      onChange={() => handleRecordChange}
                    >
                      <MediaRenderer client={client} src={url} />
                    </li>
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="theURLblock mb-4">
                  <p>Selected URL: {selectedRecord}</p>
                  <label className="block mb-2">
                    Mint NFT to Wallet Address:
                    <input
                      type="text"
                      value={mintAddress}
                      onChange={(e) => setMintAddress(e.target.value)}
                      className="block w-full px-4 py-2 border rounded-md"
                    />
                  </label>
                  <label className="block">
                    <input
                      type="checkbox"
                      checked={useLoggedInAddress}
                      onChange={() => {
                        setUseLoggedInAddress(!useLoggedInAddress);
                        if (!useLoggedInAddress) {
                          setMintAddress(walletAddress); // Set mintAddress to logged-in address
                        } else {
                          setMintAddress(""); // Clear mintAddress when unchecking
                        }
                      }}
                    />
                    Use the same address as login
                  </label>
                </div>
                <button
                  onClick={handleWriteData}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {transactionSent ? "Loading..." : "Turn Into NFT"}
                </button>
                {transactionReciept !== "" && (
                  <p> Tranaction Hash: {transactionReciept}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h4>No Documents</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}
