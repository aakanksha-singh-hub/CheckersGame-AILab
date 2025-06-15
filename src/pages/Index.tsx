import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BarChart3, BookOpen, Github, Target, Code, Brain } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Play,
      title: "Interactive Gameplay",
      description: "Play against advanced AI algorithms or watch them compete"
    },
    {
      icon: Brain,
      title: "Minimax Algorithm",
      description: "Experience classic game theory with adjustable difficulty"
    },
    {
      icon: Target,
      title: "Q-Learning RL Bot",
      description: "Watch reinforcement learning adapt and improve"
    },
    {
      icon: BarChart3,
      title: "Algorithm Comparison",
      description: "Analyze performance metrics and strategies"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              <span className="block">Checkers AI Lab</span>
              <span className="block text-blue-600">Research Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Explore the intersection of game theory and artificial intelligence through interactive gameplay and algorithm analysis.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/play">
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Playing
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link to="/learn">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to explore AI in games
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 ${
                    hoveredCard === index ? "transform -translate-y-1 shadow-lg" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-slate-500">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Checkers AI Lab</span>
              </div>
              <p className="text-slate-400">
                Exploring the intersection of game theory and artificial intelligence
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/play" className="block text-slate-400 hover:text-white transition-colors">Play Game</Link>
                <Link to="/compare" className="block text-slate-400 hover:text-white transition-colors">Compare Algorithms</Link>
                <Link to="/learn" className="block text-slate-400 hover:text-white transition-colors">Learning Resources</Link>
                <Link to="/about" className="block text-slate-400 hover:text-white transition-colors">About</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
