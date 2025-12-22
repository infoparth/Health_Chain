import { upload } from "thirdweb/storage";
import { Contract, client } from "@/constants/Contract";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { Button } from "../ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from "lucide-react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [URI, setURI] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const account = useActiveAccount();

  const fileUpload = async (_uri: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    try {
      const transaction = prepareContractCall({
        contract: Contract,
        method: "addDocument",
        params: [_uri],
      });

      if (transaction && account) {
        const transactionReceipt = await sendAndConfirmTransaction({
          account: account,
          transaction: transaction,
        });

        return transactionReceipt;
      }
    } catch (err) {
      console.error("Blockchain upload error:", err);
      throw new Error(err instanceof Error ? err.message : "Failed to upload to blockchain");
    }
  };

  const uploadToIPFS = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const uri = await upload({
        client,
        files: [file],
      });

      setURI(uri);

      const isSuccess = await fileUpload(uri);

      if (isSuccess) {
        setUploadSuccess(true);
        setTimeout(() => {
          navigate("/patient");
        }, 2000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setURI(null);
      setUploadSuccess(false);
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
            <UploadIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Upload Medical Document
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Securely store your medical records on the blockchain with IPFS
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Upload Your Document</CardTitle>
              <CardDescription>
                Choose a medical document to upload. It will be securely stored on IPFS and recorded on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Upload Failed</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Upload Successful!</p>
                    <p className="mt-1">Your document has been securely stored. Redirecting to dashboard...</p>
                  </div>
                </div>
              )}

              {/* File Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    id="picture"
                    type="file"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>

                {/* File Preview Info */}
                {file && !URI && (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB • {file.type || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Upload Button */}
                <Button
                  onClick={uploadToIPFS}
                  className="w-full h-12 text-base"
                  disabled={loading || !file || uploadSuccess}
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loading size="sm" text="" />
                      <span className="ml-2">Uploading to Blockchain...</span>
                    </span>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-5 w-5" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>

              {/* File Preview with URI */}
              {URI && file && (
                <Card className="border-2 border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      Document Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">File Name:</span>
                        <span className="font-medium text-gray-900">{file.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">File Type:</span>
                        <span className="font-medium text-gray-900">{file.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium text-gray-900">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 break-all">
                          <span className="font-medium">IPFS URI:</span> {URI}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <MediaRenderer client={client} src={URI} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Important Information
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Your document will be stored permanently on IPFS</li>
                  <li>• A blockchain transaction will record this upload</li>
                  <li>• You maintain full control over who can access this document</li>
                  <li>• Supported formats: PDF, JPG, PNG, DICOM</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/patient")}
              disabled={loading}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
