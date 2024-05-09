import { upload } from "thirdweb/storage";
import { Contract, client } from "@/constants/Contract";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { Button } from "../ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";


//
const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [URI, setURI] = useState<string | null>(null);

  const contract = Contract;

  const Navigate = useNavigate();

  const account = useActiveAccount();

  console.log("The account is: " + account);

  console.log("contract: ", contract);

  const fileUpload = async (_uri: string) => {
    try {
      const transaction = prepareContractCall({
        contract: Contract,
        method: "addDocument",
        params: [_uri],
      });

      console.log("The transaction is", transaction);

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
    if (file !== null) {
      const uri = await upload({
        client,
        files: [file],
      });

      console.log("The URI is: " + uri);

      setURI(uri);

      try {
        const isSuccess = await fileUpload(uri);

        console.log(isSuccess);
        if (isSuccess !== undefined) {
          Navigate("/patient");
        }
      } catch (error) {
        console.log("error is", error);
      }

      scrollToBottom();
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
          >
            Upload
          </Button>
        </div>
        {fileData()}
      </div>
    </div>
  );
};

export default Upload;
