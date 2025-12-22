import { useState } from "react";
import { Contract, client } from "@/constants/Contract";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { upload } from "thirdweb/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/error";
import { Coins, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UsePatientDataReturn, Document } from "@/hooks/usePatientData";

export default function NFT() {
  const [selectedRecord, setSelectedRecord] = useState<bigint>();
  const [selectedURI, setSelectedURI] = useState<string>();
  const [mintAddress, setMintAddress] = useState<string>("");
  const [useLoggedInAddress, setUseLoggedInAddress] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";
  const navigate = useNavigate();
  const patientData = useOutletContext<UsePatientDataReturn>();
  
  // Safely destructure with error handling
  const { documents, isLoading, stats } = patientData || { 
    documents: undefined, 
    isLoading: false,
    stats: { totalDocuments: 0, authorizedDoctors: 0, nftsMinted: 0 }
  };

  const callContractFunction = async () => {
    if (!mintAddress || !selectedRecord) {
      setError("Please select a document and provide a wallet address");
      return;
    }

    try {
      if (!wallet) {
        throw new Error("Wallet not connected");
      }

      const transaction = prepareContractCall({
        contract: Contract,
        method: "mintDocumentAsNFT",
        params: [mintAddress as `0x${string}`, selectedRecord],
      });

      if (transaction && wallet) {
        const receipt = await sendAndConfirmTransaction({
          account: wallet,
          transaction: transaction,
        });

        setTransactionHash(receipt.transactionHash);
        return receipt.transactionHash;
      }
    } catch (err) {
      console.error("Contract call error:", err);
      throw new Error(err instanceof Error ? err.message : "Failed to mint NFT");
    }
  };

  const handleMintNFT = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to mint this document as an NFT? This action cannot be undone."
    );

    if (!confirmed) return;

    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nftMetadata = {
        name: "Medical Records NFT",
        description: "This NFT represents ownership of medical records on the blockchain",
        image: selectedURI,
      };

      await upload({
        client,
        files: [JSON.stringify(nftMetadata)],
      });

      await callContractFunction();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint NFT");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (document: Document) => {
    if (document.isMinted) {
      alert("This document has already been minted as an NFT");
      return;
    }
    setSelectedRecord(document.documentId);
    setSelectedURI(document.documentURI);
    setError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loading text="Loading your documents..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-4">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            NFT Monetization
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your medical records into NFTs and unlock new opportunities
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {transactionHash && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800 flex-1">
                <p className="font-medium">NFT Minted Successfully!</p>
                <p className="mt-1 font-mono text-xs break-all">
                  Transaction: {transactionHash}
                </p>
              </div>
            </div>
          )}

          {documents && documents.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Document Selection */}
              <div className="lg:col-span-2">
                <Card className="border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Select Document</CardTitle>
                    <CardDescription>
                      Choose a medical record to mint as an NFT
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {documents.map((document, index) => (
                        <div
                          key={index}
                          onClick={() => handleDocumentClick(document)}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            document.documentId === selectedRecord
                              ? "border-primary shadow-lg scale-105"
                              : document.isMinted
                              ? "border-gray-300 opacity-50 cursor-not-allowed"
                              : "border-gray-200 hover:border-primary hover:shadow-md"
                          }`}
                        >
                          <div className="aspect-square">
                            <MediaRenderer
                              client={client}
                              src={document.documentURI}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          {document.isMinted && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="text-white text-center">
                                <Sparkles className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm font-medium">Already Minted</p>
                              </div>
                            </div>
                          )}
                          {document.documentId === selectedRecord && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Minting Configuration */}
              <div className="lg:col-span-1">
                <Card className="border-none shadow-xl sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-xl">Mint Configuration</CardTitle>
                    <CardDescription>
                      Configure NFT minting settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedRecord ? (
                      <>
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Selected Document</p>
                          <p className="font-semibold text-gray-900">
                            Document #{selectedRecord.toString()}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mintAddress">Recipient Wallet Address</Label>
                          <Input
                            id="mintAddress"
                            type="text"
                            placeholder="0x..."
                            value={mintAddress}
                            onChange={(e) => setMintAddress(e.target.value)}
                            disabled={loading || useLoggedInAddress}
                            className="font-mono text-sm"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="useMyAddress"
                            checked={useLoggedInAddress}
                            onCheckedChange={(checked) => {
                              setUseLoggedInAddress(checked as boolean);
                              if (checked) {
                                setMintAddress(walletAddress);
                              } else {
                                setMintAddress("");
                              }
                            }}
                          />
                          <Label htmlFor="useMyAddress" className="text-sm cursor-pointer">
                            Use my wallet address
                          </Label>
                        </div>

                        <Button
                          onClick={handleMintNFT}
                          className="w-full h-11"
                          disabled={loading || !mintAddress || !selectedRecord}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <Loading size="sm" text="" />
                              <span className="ml-2">Minting NFT...</span>
                            </span>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-5 w-5" />
                              Mint as NFT
                            </>
                          )}
                        </Button>

                        <div className="pt-4 border-t">
                          <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
                          <ul className="space-y-2 text-xs text-gray-600">
                            <li>• NFT metadata will be uploaded to IPFS</li>
                            <li>• Smart contract will mint the NFT</li>
                            <li>• NFT will be sent to specified address</li>
                            <li>• Transaction will be recorded on blockchain</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Coins className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                          Select a document from the list to mint as NFT
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto border-none shadow-xl">
              <CardContent className="p-12">
                <EmptyState
                  title="No Documents Available"
                  message="You need to upload medical documents before you can mint them as NFTs."
                  icon={<Coins className="h-16 w-16 text-gray-400" />}
                  action={{
                    label: "Upload Document",
                    onClick: () => navigate("/patient/upload")
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              About NFT Monetization
            </h4>
            <p className="text-sm text-orange-800 mb-4">
              Minting your medical records as NFTs opens up new possibilities for data ownership and monetization.
            </p>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maintain complete ownership of your medical data</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Enable potential research participation opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Create verifiable proof of medical history</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Each document can only be minted once</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
