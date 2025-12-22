import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { Contract, client } from "@/constants/Contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Activity, UserCircle, Stethoscope, AlertCircle } from "lucide-react";

type RegisterRole = "doctor" | "patient";

interface FormErrors {
  name?: string;
  age?: string;
  mobno?: string;
}

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobno: "",
  });
  const [registerAs, setRegisterAs] = useState<RegisterRole>("patient");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const account = useActiveAccount();

  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = "Valid age is required";
    } else if (ageNum < 1 || ageNum > 150) {
      newErrors.age = "Age must be between 1 and 150";
    }

    if (!formData.mobno.trim()) {
      newErrors.mobno = "Mobile number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.mobno.trim())) {
      newErrors.mobno = "Invalid mobile number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    if (!account) {
      setErrorMessage("Please connect your wallet first");
      return;
    }

    setLoading(true);

    try {
      const transaction = prepareContractCall({
        contract: Contract,
        method: registerAs === "doctor" ? "registerDoctor" : "registerPatient",
        params: [formData.name, parseInt(formData.age), formData.mobno],
      });

      if (transaction && account) {
        const transactionReceipt = await sendAndConfirmTransaction({
          account: account,
          transaction: transaction,
        });

        if (transactionReceipt) {
          navigate(`/${registerAs}`);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-600">Connect your wallet to get started</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Wallet Required</p>
                <p className="mt-1">Please connect your wallet to create an account.</p>
              </div>
            </div>

            <div className="space-y-4">
              <ConnectButton client={client} wallets={wallets} />
              
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {loading ? "Creating Your Account..." : "Create Your Account"}
            </h1>
            <p className="text-blue-100">Join SecureMed today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Registration Failed</p>
                  <p className="mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">I am registering as:</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRegisterAs("patient")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    registerAs === "patient"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-gray-900">Patient</p>
                  <p className="text-sm text-gray-600 mt-1">Manage my records</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegisterAs("doctor")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    registerAs === "doctor"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-gray-900">Doctor</p>
                  <p className="text-sm text-gray-600 mt-1">Access patient records</p>
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Age Field */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Enter your age"
                className={errors.age ? "border-red-500" : ""}
                disabled={loading}
                min="1"
                max="150"
              />
              {errors.age && (
                <p className="text-sm text-red-600">{errors.age}</p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-2">
              <Label htmlFor="mobno">Mobile Number *</Label>
              <Input
                id="mobno"
                type="tel"
                value={formData.mobno}
                onChange={(e) => handleInputChange("mobno", e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className={errors.mobno ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.mobno && (
                <p className="text-sm text-red-600">{errors.mobno}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loading size="sm" text="" />
                  <span className="ml-2">Creating Account...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Footer Links */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By creating an account, you agree to our{" "}
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
