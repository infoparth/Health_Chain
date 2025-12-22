import { useState } from "react";
import { Contract, client } from "@/constants/Contract";
import { useReadContract, useActiveAccount, MediaRenderer } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/error";
import { Stethoscope, Users, FileText, X, ChevronLeft } from "lucide-react";

interface ChildProps {
  input: string;
  onBack: () => void;
}

const ChildComponent = ({ input, onBack }: ChildProps) => {
  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";

  const { data: record_list, isLoading } = useReadContract({
    contract: Contract,
    method: "getDoctorAccessibleDocuments",
    params: [walletAddress as `0x${string}`, input as `0x${string}`],
    queryOptions: {
      enabled: !!walletAddress && !!input, // Only fetch when both are available
    }
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="py-12">
        <Loading text="Loading patient documents..." size="lg" />
      </div>
    );
  }

  if (selectedImage) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-6xl w-full">
          <Button
            onClick={() => setSelectedImage(null)}
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 z-10"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="bg-white rounded-lg p-4">
            <MediaRenderer client={client} src={selectedImage} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Patient Documents</h3>
        <Button onClick={onBack} variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </Button>
      </div>

      {record_list && record_list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {record_list.map((document, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={() => setSelectedImage(document?.documentURI)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <MediaRenderer 
                    client={client} 
                    src={document?.documentURI}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Click to view</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              title="No Documents Found"
              message="This patient hasn't uploaded any documents yet or you don't have access to them."
              icon={<FileText className="h-16 w-16 text-gray-400" />}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Doctor: React.FC = () => {
  const [selectedPatient, setSelectPatient] = useState<string>("");

  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";

  const { data: patient_list, isLoading } = useReadContract({
    contract: Contract,
    method: "getMyPatients",
    params: [walletAddress as `0x${string}`],
    queryOptions: {
      enabled: !!walletAddress, // Only fetch when wallet is connected
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loading text="Loading your patients..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Doctor Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access and review patient medical records securely
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {patient_list?.length || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Under your care</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Documents Accessed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">-</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">-</div>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-none shadow-xl bg-white">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  {selectedPatient ? "Patient Records" : "Your Patients"}
                </CardTitle>
                <CardDescription>
                  {selectedPatient 
                    ? "View and manage patient documents" 
                    : "Select a patient to view their medical records"
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedPatient ? (
              patient_list && patient_list.length > 0 ? (
                <div className="space-y-3">
                  {patient_list.map((patientAddress, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectPatient(patientAddress)}
                      className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                            Patient #{index + 1}
                          </p>
                          <p className="text-sm text-gray-500 font-mono">
                            {patientAddress.slice(0, 6)}...{patientAddress.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Records
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Patients Found"
                  message="You don't have any patients yet. Patients need to grant you access to their medical records."
                  icon={<Users className="h-16 w-16 text-gray-400" />}
                />
              )
            ) : (
              <ChildComponent 
                input={selectedPatient} 
                onBack={() => setSelectPatient("")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Doctor;
