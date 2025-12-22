import { Link } from "react-router-dom";
import { Activity, Github, Twitter, Linkedin, Mail } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white">SecureMed</span>
            </Link>
            <p className="text-sm text-neutral-400">
              Secure blockchain-based medical records management with AI-powered insights and NFT monetization.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@securemed.com"
                className="hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors">
                  HIPAA Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-400">
              © {currentYear} SecureMed. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-neutral-400">
              <span>Built on</span>
              <a
                href="https://polygon.technology/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Polygon
              </a>
              <span>•</span>
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                thirdweb
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer