import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Contract } from "@/constants/Contract";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/error";
import { Shield, UserPlus, UserMinus, AlertCircle, Stethoscope, CheckCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { UsePatientDataReturn } from "@/hooks/usePatientData";

export default function Access() {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [newDoctorAddress, setNewDoctorAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";
  const patientData = useOutletContext<UsePatientDataReturn>();
  
  // Safely destructure with error handling
  const { doctors, isLoading, refetchDoctors } = patientData || { 
    doctors: undefined, 
    isLoading: false,
    refetchDoctors: () => {}
  };

  const callContractFunction = async (task: string) => {
    if (!newDoctorAddress && !selectedAddress) {
      setError("Please provide a doctor address");
      return;
    }

    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

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
          "Are you sure you want to revoke access from this doctor?"
        );

        if (!confirmed) {
          setLoading(false);
          return;
        }

        transaction = prepareContractCall({
          contract: Contract,
          method: "revokeAccessFromDoctor",
          params: [selectedAddress as `0x${string}`],
        });
      }

      if (transaction && wallet) {
        await sendAndConfirmTransaction({
          account: wallet,
          transaction: transaction,
        });

        setSuccess(
          task === "grantAccess" 
            ? "Access granted successfully!" 
            : "Access revoked successfully!"
        );
        
        setNewDoctorAddress("");
        setSelectedAddress("");
        
        // Refetch doctor list
        if (refetchDoctors) {
          refetchDoctors();
        }
      }
    } catch (err) {
      console.error("Contract call error:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loading text="Loading access management..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Access Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Control who can view your medical records
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Success!</p>
                <p className="mt-1">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Grant Access Card */}
          <Card className="border-none shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserPlus className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Grant Access</CardTitle>
                  <CardDescription>
                    Add a new doctor to access your medical records
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorAddress">Doctor's Wallet Address</Label>
                <Input
                  id="doctorAddress"
                  type="text"
                  placeholder="0x..."
                  value={newDoctorAddress}
                  onChange={(e) => setNewDoctorAddress(e.target.value)}
                  disabled={loading}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  Enter the blockchain wallet address of the doctor you want to grant access to
                </p>
              </div>

              <Button
                onClick={() => callContractFunction("grantAccess")}
                className="w-full h-11"
                disabled={loading || !newDoctorAddress}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loading size="sm" text="" />
                    <span className="ml-2">Processing...</span>
                  </span>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Grant Access
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Authorized Doctors Card */}
          <Card className="border-none shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Authorized Doctors</CardTitle>
                  <CardDescription>
                    Manage doctors who have access to your records
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {doctors && doctors.length > 0 ? (
                <div className="space-y-3">
                  {doctors.map((doctorAddress, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedAddress === doctorAddress
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900">Doctor #{index + 1}</p>
                            <p className="text-sm text-gray-500 font-mono truncate">
                              {doctorAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {selectedAddress === doctorAddress ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAddress("")}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => callContractFunction("revokeAccess")}
                                disabled={loading}
                              >
                                {loading ? (
                                  <Loading size="sm" text="" />
                                ) : (
                                  <>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Revoke
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAddress(doctorAddress)}
                            >
                              Revoke Access
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Authorized Doctors"
                  message="You haven't granted access to any doctors yet. Add a doctor's wallet address above to get started."
                  icon={<Stethoscope className="h-16 w-16 text-gray-400" />}
                />
              )}
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Information
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Only doctors you explicitly grant access to can view your medical records</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You can revoke access at any time with immediate effect</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All access changes are recorded on the blockchain for transparency</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Make sure to verify the doctor's wallet address before granting access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
