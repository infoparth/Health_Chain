import { useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Eye, Shield, Coins, Activity, ArrowRight } from "lucide-react";
import { UsePatientDataReturn } from "@/hooks/usePatientData";
import { Loading } from "@/components/ui/loading";

function Patient() {
  const navigate = useNavigate();
  const patientData = useOutletContext<UsePatientDataReturn>();
  
  // Safely destructure with defaults
  const { stats, isLoading } = patientData || { stats: { totalDocuments: 0, authorizedDoctors: 0, nftsMinted: 0 }, isLoading: false };

  const dashboardActions = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Securely upload your medical records to the blockchain",
      action: () => navigate("/patient/upload"),
      color: "from-blue-500 to-cyan-500",
      hoverColor: "group-hover:shadow-blue-200"
    },
    {
      icon: Eye,
      title: "View Documents",
      description: "Access and review all your stored medical documents",
      action: () => navigate("/patient/view"),
      color: "from-purple-500 to-pink-500",
      hoverColor: "group-hover:shadow-purple-200"
    },
    {
      icon: Shield,
      title: "Access Management",
      description: "Control which doctors can view your medical records",
      action: () => navigate("/patient/access"),
      color: "from-green-500 to-emerald-500",
      hoverColor: "group-hover:shadow-green-200"
    },
    {
      icon: Coins,
      title: "NFT Monetization",
      description: "Convert your medical records into valuable NFTs",
      action: () => navigate("/patient/nft"),
      color: "from-orange-500 to-red-500",
      hoverColor: "group-hover:shadow-orange-200"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loading text="Loading dashboard..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Patient Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your medical records securely on the blockchain. Choose an action below to get started.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.totalDocuments ?? "-"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Stored securely</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Authorized Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.authorizedDoctors ?? "-"}
              </div>
              <p className="text-xs text-gray-500 mt-1">With access</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">NFTs Minted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.nftsMinted ?? "-"}
              </div>
              <p className="text-xs text-gray-500 mt-1">From records</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className={`group border-none shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white overflow-hidden ${item.hoverColor}`}
                onClick={item.action}
              >
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary/5 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <Card className="mt-12 border-none shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Need Help?</CardTitle>
            <CardDescription className="text-blue-100">
              Learn more about managing your medical records on SecureMed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                View Documentation
              </Button>
              <Button variant="outline" className="border-white text-primary hover:bg-white/10">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Patient;
