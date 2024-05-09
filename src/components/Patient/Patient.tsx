import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Patient() {
  const navigate = useNavigate();
  return (
    <div className="flex bg-gradient-to-br from-[#c9def4] to-[#b8a4c9] justify-center items-center h-screen">
      <div className="p-4  text-center text-7xl">
        What would you like to do?
        <div className="mt-4 space-y-2 bg-gradient-to-br from-[#ebf4f5] to-[#b5c6e0]">
          <div>
            <Button
              variant="ghost"
              className="mr-2 text-2xl"
              onClick={() => navigate("/upload")}
            >
              Upload Documents
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              className="mr-2 text-2xl"
              onClick={() => navigate("/view")}
            >
              View Documents
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              className="mr-2 text-2xl"
              onClick={() => navigate("/access")}
            >
              Access Management
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              className="text-2xl"
              onClick={() => navigate("/nft")}
            >
              NFT Monetization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Patient;
