import React, { useState, useEffect } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { useNavigate } from "react-router-dom";
import { Contract } from "@/constants/Contract";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  console.log("The contract is:", Contract);

  const userWallet = useActiveAccount();

  const walletAddress = userWallet?.address || "";

  console.log("Wallet address is:", walletAddress);

  const navigate = useNavigate();

  const [isPatient, setIsPatient] = useState<boolean | undefined>(false);
  const [isDoctor, setIsDoctor] = useState<boolean | undefined>(false);
  const [userAddress, setUserAddress] = useState<string | undefined>();

  console.log("called");
  const { data: patientData, isLoading } = useReadContract({
    contract: Contract,
    method: "checkPatient",
    params: [walletAddress],
  });

  console.log(isLoading);
  const { data: doctorData } = useReadContract({
    contract: Contract,
    method: "checkDoc",
    params: [walletAddress],
  });

  console.log("The returned address is:", doctorData);
  console.log("The returned address is:", patientData);

  console.log("The user address is:", userAddress);

  useEffect(() => {
    setIsPatient(patientData);
    setIsDoctor(doctorData);
    const userAdd = userWallet?.address;
    setUserAddress(userAdd);
  }, [patientData, doctorData, userWallet]);

  const clickedButton = async () => {
    console.log("inside clicked");

    try {
      if (userAddress) {
        console.log("in the if block");

        if (isPatient === true) {
          navigate("/patient");
        } else if (isDoctor === true) {
          navigate("/doctor");
        } else {
          navigate("/register");
        }
      } else {
        console.log("in the else block");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center bg-gradient-to-br from-[#c9def4] to-[#b8a4c9] items-center h-screen">
      <div className="text-center p-8 bg-gradient-to-br from-[#ebf4f5] to-[#b5c6e0] rounded-t-lg">
        <h1 className="Message mb-4 text-5xl">Welcome to SecureMed!</h1>
        <div className="auth-form-container mb-4">
          <h2 className="text-3xl">Login</h2>
          {Contract && userWallet && (
            <Button className="mt-2" onClick={clickedButton}>
              Click Me
            </Button>
          )}
        </div>
        <button
          className="link-btn text-2xl"
          onClick={() => navigate("/doctor")}
        >
          Don't have an account? Register here.
        </button>
      </div>
    </div>
  );
};

export default Login;
