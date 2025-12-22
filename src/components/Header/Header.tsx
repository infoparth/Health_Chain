    import { useState } from "react";
  import { Link, useLocation } from "react-router-dom";
  import { ConnectButton } from "thirdweb/react";
  import { client } from "@/constants/Contract";
  import { Menu, X, Activity } from "lucide-react";

  function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isLandingPage = location.pathname === "/";

    const navigation = [
      { name: "Home", path: "/" },
      { name: "Features", path: "/#features" },
      { name: "About", path: "/#about" },
    ];

    const isActive = (path: string) => location.pathname === path;

    if (isLandingPage) {
      return null;
    }

    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              <Activity className="h-8 w-8 text-primary" />
              <span className="hidden sm:inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SecureMed
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-neutral-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <ConnectButton client={client} />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-neutral-600"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t">
                  <ConnectButton client={client} />
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  }

  export default Header;
