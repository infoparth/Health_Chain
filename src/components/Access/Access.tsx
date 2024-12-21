import { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { Contract } from "@/constants/Contract";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

export default function Access() {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [newDoctorAddress, setNewDoctorAddress] = useState("");

  const wallet = useActiveAccount();

  const walletAddress = wallet?.address || "";

  console.log("walletAddress", walletAddress);

  console.log("Connecting to", Contract);

  const { data: doctor_list } = useReadContract({
    contract: Contract,
    method: "getMyDoctors",
    params: [walletAddress as `0x${string}`],
  });

  console.log("Got something:", doctor_list);

  console.log("selected address is", selectedAddress);

  const callContractFunction = async (task: string) => {
    if (newDoctorAddress || selectedAddress) {
      try {
        let transaction;
        if (task === "grantAccess") {
          transaction = prepareContractCall({
            contract: Contract,
            method: "grantAccessToDoctor",
            params: [newDoctorAddress as `0x${string}`],
          });
        } else if (task === "revokeAccess") {
          const confirmed = window.confirm(
            "Are you sure you want to revoke access ?"
          );

          if (confirmed) {
            transaction = prepareContractCall({
              contract: Contract,
              method: "revokeAccessFromDoctor",
              params: [selectedAddress as `0x${string}`],
            });
          } else {
            console.log("Revoke Cancelled");
          }
        }

        console.log("The transaction is", transaction);

        if (transaction !== undefined && wallet) {
          const transactionReceipt = await sendAndConfirmTransaction({
            account: wallet,
            transaction: transaction,
          });

          console.log("The Transaction Reciept is: ", transactionReceipt);

          return transactionReceipt;
        }
      } catch (err) {
        console.log("Error is:", err);
      }
    } else {
      console.log("Can't find the mint address and selected record");
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(event.target.value);
  };

  if (Contract && doctor_list !== undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
        <div className="text-center p-8 bg-gray rounded-lg shadow-lg">
          <div className="mb-4">
            <h4 className="mb-2 text-2xl">The Addresses</h4>
            <select
              value={selectedAddress}
              onChange={handleAddressChange}
              className="block w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select an address</option>
              {doctor_list.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
            <button
              onClick={() => callContractFunction("revokeAccess")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Revoke Access
            </button>
          </div>
          <div>
            <h4 className="mb-2">Add a Doctor</h4>
            <input
              type="text"
              placeholder="Enter doctor's wallet address"
              value={newDoctorAddress}
              onChange={(e) => setNewDoctorAddress(e.target.value)}
              className="block w-full px-4 py-2 border rounded-md"
            />
            <button
              onClick={() => callContractFunction("grantAccess")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Doctor
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h4 className="mb-2">Add a Doctor</h4>
            <input
              type="text"
              placeholder="Enter doctor's wallet address"
              value={newDoctorAddress}
              onChange={(e) => setNewDoctorAddress(e.target.value)}
              className="block w-full px-4 py-2 mb-4 border rounded-md"
            />
            <button
              onClick={() => callContractFunction("grantAccess")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Doctor
            </button>
          </div>
        </div>
      </div>
    );
  }
}
