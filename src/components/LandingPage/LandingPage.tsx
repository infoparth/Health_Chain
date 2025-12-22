import { useNavigate } from "react-router-dom";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "@/constants/Contract";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Zap, 
  Users, 
  FileText, 
  TrendingUp,
  Activity,
  CheckCircle,
  ArrowRight
} from "lucide-react";

import logo from "../../images/securemed.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const account = useActiveAccount();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Your medical records are secured on the blockchain, ensuring immutability and transparency."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Advanced encryption and access controls keep your sensitive health data private."
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Access your medical records anytime, anywhere with seamless connectivity."
    },
    {
      icon: Users,
      title: "Doctor Management",
      description: "Grant and revoke access to healthcare providers with complete control."
    },
    {
      icon: FileText,
      title: "Document Storage",
      description: "Store all your medical documents securely on IPFS with blockchain verification."
    },
    {
      icon: TrendingUp,
      title: "NFT Monetization",
      description: "Convert your medical records into NFTs and unlock new opportunities."
    }
  ];

  const benefits = [
    "Decentralized storage on IPFS",
    "Smart contract powered",
    "Real-time access management",
    "Interoperable across platforms"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Activity className="h-4 w-4" />
                <span>Powered by Blockchain Technology</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Medical Records,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Secured Forever
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                A blockchain-enabled medical records manager with AI-powered insights and NFT monetization. 
                Take control of your health data today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <ConnectButton client={client} />
                {account && (
                  <Button 
                    size="lg"
                    onClick={() => navigate("/login")}
                    className="group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Logo */}
            <div className="relative lg:pl-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />
                <img 
                  src={logo} 
                  alt="SecureMed Logo" 
                  className="relative w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SecureMed?
            </h2>
            <p className="text-lg text-gray-600">
              Cutting-edge technology meets healthcare. Experience the future of medical records management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100">
              Join thousands of patients and healthcare providers using SecureMed to secure and manage medical records.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => navigate("/register")}
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-500"
              >
                Create Account
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-2 border-white text-blue-600 hover:bg-gray-100 hover:text-blue-500 transition-all"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
