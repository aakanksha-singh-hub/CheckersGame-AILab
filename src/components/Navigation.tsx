import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Checkers AI Lab</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/play" className="text-slate-600 hover:text-blue-600 transition-colors">Play</Link>
            <Link to="/compare" className="text-slate-600 hover:text-blue-600 transition-colors">Compare</Link>
            <Link to="/learn" className="text-slate-600 hover:text-blue-600 transition-colors">Learn</Link>
            <Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 