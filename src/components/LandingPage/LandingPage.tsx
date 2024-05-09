import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/constants/Contract";
import { Button } from "@/components/ui/button";

import logo from "../../images/securemed.png";

const Securemed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#ebf4f5] to-[#b5c6e0] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="text-center text-9xl">
          <h2>Welcome To Securemed!</h2>
        </div>
        <div className="mt-4">
          <img className="image" src={logo} alt="Logo" />
        </div>
        <div className="text-center mt-4 text-3xl">
          <h4>
            A Blockchain-Enabled Medical Records Manager with AI-Powered
            Insights and NFT Monetization
          </h4>
        </div>
        <div className="mt-4">
          <ConnectButton client={client} />
        </div>
        <div className="mt-4">
          <Button className="loginButton" onClick={() => navigate("/login")}>
            Click to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Securemed;
