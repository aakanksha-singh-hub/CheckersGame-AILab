import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Link, Calendar, Users, Code, Brain, Database, BarChart3, Target, Code2, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Link as RouterLink } from "react-router-dom";

const AboutPage = () => {
  const technologies = [
    { name: "TypeScript", purpose: "Primary language for frontend and game logic", category: "Language" },
    { name: "React", purpose: "Frontend UI library", category: "Framework" },
    { name: "Node.js", purpose: "JavaScript runtime for development and build tools", category: "Runtime" },
    { name: "Vite", purpose: "Fast frontend build tool", category: "Tool" },
    { name: "Tailwind CSS", purpose: "Utility-first CSS framework for styling", category: "Framework" },
    { name: "Lucide React", purpose: "Icon library for React components", category: "Library" },
    { name: "Minimax", purpose: "Game AI algorithm for optimal decision-making", category: "Algorithm" },
    { name: "Q-Learning", purpose: "Reinforcement learning algorithm for AI agent training", category: "Algorithm" },
    { name: "HTML5", purpose: "Structure of the web application", category: "Language" },
    { name: "CSS3", purpose: "Styling and layout of the web application", category: "Language" },
    { name: "Git", purpose: "Version control system", category: "Tool" }
  ];

  const features = [
    {
      title: "Research Focus",
      icon: Brain,
      description: "Our platform enables comparative analysis of traditional game tree search algorithms versus modern machine learning approaches in strategic decision-making environments."
    },
    {
      title: "Educational Value",
      icon: BookOpen,
      description: "Designed as an educational tool to help students and researchers understand the strengths and limitations of different AI approaches in game theory."
    },
    {
      title: "Technical Implementation",
      icon: Code2,
      description: "Built with modern web technologies and optimized for performance, allowing real-time visualization of algorithm decision-making processes."
    },
    {
      title: "Future Development",
      icon: Target,
      description: "Ongoing development to add more algorithms, improve visualization capabilities, and enhance the learning experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">About the Project</h1>
          <p className="mt-2 text-lg text-slate-600">
            A research platform for exploring AI algorithms in game theory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Overview */}
        <Card className="mt-8 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Mission Statement</h3>
                <p className="text-slate-600 mb-6">
                  Checkers AI Lab was created to explore and compare different artificial intelligence 
                  approaches in the context of strategic board games. Our goal is to demonstrate how 
                  classical algorithms like Minimax compare with modern machine learning techniques 
                  like Q-Learning in a real-world gaming scenario.
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Research Questions</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    How do classical and ML algorithms compare in strategic gameplay?
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    Can reinforcement learning discover novel strategies?
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    What are the computational trade-offs between approaches?
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Key Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <span className="text-slate-700">Successfully implemented both Minimax and Q-Learning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <span className="text-slate-700">Achieved 89% peak accuracy in AI vs human games</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <span className="text-slate-700">Analyzed 10,000+ game scenarios for comparison</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <span className="text-slate-700">Created interactive learning platform</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-6 h-6" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{tech.name}</h4>
                    <Badge variant="outline" className="text-xs">{tech.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{tech.purpose}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Research Base */}
        {/* REMOVED: Previous 'Research Foundation' section content */}

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
                <RouterLink to="/play" className="block text-slate-400 hover:text-white transition-colors">Play Game</RouterLink>
                <RouterLink to="/compare" className="block text-slate-400 hover:text-white transition-colors">Compare Algorithms</RouterLink>
                <RouterLink to="/learn" className="block text-slate-400 hover:text-white transition-colors">Learning Resources</RouterLink>
                <RouterLink to="/about" className="block text-slate-400 hover:text-white transition-colors">About</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
