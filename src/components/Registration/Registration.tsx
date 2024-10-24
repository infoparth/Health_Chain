import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { Contract, client } from "@/constants/Contract";

export const Register = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [mobno, setMobno] = useState("");
  const [registerAs, setRegisterAs] = useState("doctor");
  const navigate = useNavigate();

  console.log("Inside Registration");

  const account = useActiveAccount();

  console.log("The account is: " + account);

  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  const handleRegisterAs = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegisterAs(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(registerAs);
    try {
      let is_success;
      if (registerAs === "doctor") {
        is_success = await callContractFunction("doctor");
      } else if (registerAs === "patient") {
        is_success = await callContractFunction("patient");
        console.log("The value of is success is ", is_success);
        if (is_success) {
          navigate(`/${registerAs}`);
        } else {
          // Handle the case where the transaction was not successful
          console.log("Patient registration failed");
        }
      }
    } catch (err) {
      console.log("The Error is", err);
    }
  };

  const callContractFunction = async (as: string) => {
    try {
      let transaction;

      if (as === "doctor") {
        console.log("Creating Doc");
        transaction = prepareContractCall({
          contract: Contract,
          method: "addDoc",
          params: [name, age, mobno],
        });
      } else {
        console.log("Creating Patient");
        transaction = prepareContractCall({
          contract: Contract,
          method: "addPatient",
          params: [name, age, mobno],
        });
      }

      console.log("The transaction is", transaction);

      if (transaction !== undefined && account) {
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
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
      <ConnectButton client={client} wallets={wallets} />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center mb-4 text-5xl">Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Full Name
            </label>
            <input
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Full Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block mb-1">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              id="age"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Age"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mobno" className="block mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobno}
              onChange={(e) => setMobno(e.target.value)}
              id="mobno"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="+91XXXXXXXXXX"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="options" className="block mb-1">
              Register As:
            </label>
            <select
              name="options"
              onChange={(e) => handleRegisterAs(e)}
              id="options"
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit Details
          </button>
        </form>
        <button
          className="mt-4 text-center text-blue-500 hover:underline"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login here.
        </button>
      </div>
    </div>
  );
};
