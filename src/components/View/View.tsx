import { client } from "@/constants/Contract";
import { MediaRenderer } from "thirdweb/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/error";
import { Eye, X, FileText, Download, Calendar } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UsePatientDataReturn } from "@/hooks/usePatientData";

export default function View() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const navigate = useNavigate();
  const patientData = useOutletContext<UsePatientDataReturn>();

  // Safely destructure with error handling
  const { documents, isLoading } = patientData || {
    documents: undefined,
    isLoading: false,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loading text="Loading your documents..." size="lg" />
      </div>
    );
  }

  if (selectedDocument) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-6xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold">
              Document Preview
            </h2>
            <Button
              onClick={() => setSelectedDocument(null)}
              variant="secondary"
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="bg-white rounded-lg p-4">
            <MediaRenderer client={client} src={selectedDocument} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            My Medical Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all your securely stored medical records
          </p>
        </div>

        {/* Stats Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Documents</CardTitle>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {documents?.length || 0}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Documents Grid */}
        <div className="max-w-7xl mx-auto">
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden border-none"
                  onClick={() => setSelectedDocument(document?.documentURI)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <MediaRenderer
                        client={client}
                        src={document?.documentURI}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                View Document
                              </span>
                            </div>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(document?.documentURI, "_blank");
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>Document #{index + 1}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Stored on blockchain</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto border-none shadow-xl">
              <CardContent className="p-12">
                <EmptyState
                  title="No Documents Yet"
                  message="You haven't uploaded any medical documents. Start by uploading your first document to the blockchain."
                  icon={<FileText className="h-16 w-16 text-gray-400" />}
                  action={{
                    label: "Upload Document",
                    onClick: () => navigate("/patient/upload"),
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Button */}
        {documents && documents.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={() => navigate("/patient/upload")}
              size="lg"
              className="shadow-lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              Upload New Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
