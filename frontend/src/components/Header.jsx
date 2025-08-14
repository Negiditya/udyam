export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-wide">MSME Verification</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-white hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-800 font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-800 font-medium"
          >
            NIC Code
          </a>
          <a
            href="#"
            className="text-white hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-800 font-medium"
          >
            Acts & Rules
          </a>
          <a
            href="#"
            className="text-white hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-800 font-medium"
          >
            Contact Us
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center px-3 py-2 border border-blue-700 rounded text-blue-200 hover:text-white hover:border-white transition-colors duration-200">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
