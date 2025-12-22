import { useState, useEffect } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { useNavigate, Link } from "react-router-dom";
import { Contract } from "@/constants/Contract";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error";
import { Activity, UserCircle, Stethoscope, AlertCircle } from "lucide-react";

interface UserData {
  role?: number;
}

const Login = () => {
  const navigate = useNavigate();
  const userWallet = useActiveAccount();
  const walletAddress = userWallet?.address || "";

  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: userData, isLoading, error } = useReadContract({
    contract: Contract,
    method: "getUserDetails",
    params: [walletAddress as `0x${string}`],
    queryOptions: {
      enabled: !!walletAddress, // Only fetch when wallet is connected
    }
  });

useEffect(() => {
  if (isLoading || !walletAddress) return;

  handleUserRedirect(userData as UserData | undefined);
}, [userData, isLoading, walletAddress]);


const handleUserRedirect = (data?: UserData) => {
  if (isRedirecting) return;

  setIsRedirecting(true);

  const role = data?.role;

  if (role === 1) {
    navigate("/doctor");
  } else if (role === 2) {
    navigate("/patient");
  } else {
    navigate("/register");
  }
};

  const handleLogin = () => {
    if (!walletAddress) {
      return;
    }

    if (userData) {
      handleUserRedirect(userData as UserData);
    }
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600">Connect your wallet to continue</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Wallet Not Connected</p>
                <p className="mt-1">Please connect your wallet to access your account.</p>
              </div>
            </div>

            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Loading 
              text="Verifying your account..." 
              size="lg"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ErrorMessage
              title="Unable to verify account"
              message="There was an error connecting to the blockchain. Please try again."
              onRetry={() => window.location.reload()}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-blue-100">Sign in to manage your medical records</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {userData ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {(userData as UserData).role === 1 ? (
                        <Stethoscope className="h-6 w-6 text-white" />
                      ) : (
                        <UserCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Logged in as</p>
                      <p className="font-medium text-gray-900">
                        {(userData as UserData).role === 1 ? "Doctor" : 
                         (userData as UserData).role === 2 ? "Patient" : "New User"}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleLogin}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    Continue to Dashboard
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Not your account?{" "}
                    <Link to="/" className="text-primary hover:underline font-medium">
                      Disconnect wallet
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <UserCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Account Not Found</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      No account is associated with this wallet address.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    Create New Account
                  </Button>
                  
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our{" "}
          <Link to="/" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
