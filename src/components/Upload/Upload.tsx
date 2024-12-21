import { upload } from "thirdweb/storage";
import { Contract, client } from "@/constants/Contract";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import {
  prepareContractCall,
  sendAndConfirmTransaction,
  simulateTransaction,
} from "thirdweb";
import { Button } from "../ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

//
const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [URI, setURI] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  const account = useActiveAccount();

  const fileUpload = async (_uri: string) => {
    try {
      const transaction = prepareContractCall({
        contract: Contract,
        method: "addDocument",
        params: [_uri],
      });

      const result = await simulateTransaction({
        transaction,
        account: account,
      });
      console.log("simulation result", result);

      if (transaction && account) {
        const transactionReceipt = await sendAndConfirmTransaction({
          account: account,
          transaction: transaction,
        });

        console.log("The Transaction Reciept is: ", transactionReceipt);

        return transactionReceipt;
      }
    } catch (err) {
      console.log("Error is:", err);
    }
  };

  const uploadToIPFS = async () => {
    console.log("File Upload to IPFS start: ", Date.now());
    if (file !== null) {
      setLoading(true);
      const uri = await upload({
        client,
        files: [file],
      });
      console.log("The URI is: " + uri);
      console.log("File Upload to IPFS ends: ", Date.now());

      setURI(uri);

      try {
        console.log("Smart Contract Initiaition start: ", Date.now());
        const isSuccess = await fileUpload(uri);
        console.log("Smart Contract call done: ", Date.now());

        if (isSuccess !== undefined) {
          Navigate("/patient");
        }
      } catch (error) {
        console.log("error is", error);
      }

      scrollToBottom();
      setLoading(false);
    } else {
      alert("Please select a file to upload");
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const fileData = () => {
    if (file !== null) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {file.name}</p>

          <p>File Type: {file.type}</p>

          <p>Last Modified: {file.lastModified?.toString()}</p>
          <p>File URI: {URI}</p>
          <MediaRenderer client={client} src={URI} />
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <div className="flex  bg-gradient-to-br from-[#c9def4] to-[#b8a4c9] flex-col items-center justify-center h-screen">
      <div className="Firstpage text-center p-4">
        <h3 className="mb-4 text-3xl">Choose file to upload</h3>
        <div className="mb-4">
          <div className="grid w-full max-w-sm items-center gap-1.5 mr-2">
            <Input
              id="picture"
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <Button
            onClick={uploadToIPFS}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Loading..." : "Upload"}
          </Button>
        </div>
        {fileData()}
      </div>
    </div>
  );
};

export default Upload;
