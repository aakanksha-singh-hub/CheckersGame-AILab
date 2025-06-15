import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Search, Code, BookOpen, Lightbulb, Users, GraduationCap, Github } from "lucide-react";
import { Link } from "react-router-dom";

const LearnPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">📘 Learn Page – Deep Dive into CheckersGame AI</h1>
          <p className="mt-4 text-lg text-slate-600">
            Explore the core algorithms, implementation insights, and learning materials behind our AI-powered Checkers platform.
          </p>
        </div>

        {/* Minimax Algorithm */}
        <Card className="mb-8">
              <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Search className="w-6 h-6 text-blue-600" />
              ♟️ Minimax Algorithm – Strategic Search in Game Theory
                </CardTitle>
              </CardHeader>
          <CardContent className="text-slate-700 leading-relaxed">
            <p className="mb-4">The Minimax algorithm is a decision-making strategy used in two-player turn-based games. It assumes that both players play optimally.</p>
            <h3 className="text-lg font-semibold mb-3">🔍 Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Game Trees & State Space:</strong> Understand how all possible game states are mapped as a recursive tree. Each node represents a move; leaf nodes indicate terminal outcomes.</li>
              <li><strong>Alpha-Beta Pruning:</strong> A technique to optimize Minimax by pruning unnecessary branches, significantly reducing the number of nodes evaluated.</li>
              <li><strong>Evaluation Functions & Heuristics:</strong> Custom scoring functions assign values to board states based on number of pieces, king positions, and control over the board.</li>
              <li><strong>Depth-Limited Search:</strong> Due to exponential complexity, search is limited to a fixed depth (typically 2–4). The evaluation function is applied at leaf nodes.</li>
                      </ul>
            <p className="font-bold">📚 Minimax is ideal for well-defined environments where the opponent's behavior can be predicted with high certainty.</p>
              </CardContent>
            </Card>

        {/* Q-Learning */}
        <Card className="mb-8">
              <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="w-6 h-6 text-purple-600" />
              🤖 Q-Learning – Adaptive Learning through Experience
                </CardTitle>
              </CardHeader>
          <CardContent className="text-slate-700 leading-relaxed">
            <p className="mb-4">Q-Learning is a model-free reinforcement learning algorithm. It allows agents to learn optimal policies by interacting with the environment and refining decisions based on feedback.</p>
            <h3 className="text-lg font-semibold mb-3">🔍 Key Concepts:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Reinforcement Learning Fundamentals:</strong> The agent observes a state, performs an action, receives a reward, and updates a Q-value mapping (state → action → expected return).</li>
              <li><strong>Q-Table Implementation:</strong> A 2D table stores values for every state-action pair. The agent selects actions based on these learned values.</li>
              <li><strong>Exploration vs Exploitation:</strong> Balancing between exploring new moves (exploration) and choosing the best-known move (exploitation) is crucial. Typically managed using ε-greedy policies.</li>
              <li><strong>Reward Function Design:</strong> We assign positive rewards for captures, king promotions, and wins. Negative rewards discourage losses or poor positioning.</li>
            </ul>
            <p className="font-bold">📚 Q-Learning is powerful for environments where agents must adapt over time, including playing against unpredictable opponents.</p>
              </CardContent>
            </Card>

        {/* Implementation Details */}
        <Card className="mb-8">
              <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Code className="w-6 h-6 text-orange-600" />
              🧱 Implementation Details – Under the Hood
                </CardTitle>
              </CardHeader>
          <CardContent className="text-slate-700 leading-relaxed">
            <p className="mb-4">Take a look at how Minimax and Q-Learning were implemented in our Python-based game engine.</p>
            <h3 className="text-lg font-semibold mb-3">🧠 Core Implementation Aspects:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Game State Representation:</strong> The board is represented using a NumPy matrix, with unique identifiers for player pieces and kings.</li>
              <li><strong>Move Generation & Validation:</strong> Rules like diagonal movement, forced captures, and king moves are implemented through object-oriented design.</li>
              <li><strong>Performance Optimization:</strong>
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Minimax uses depth-limited recursion with alpha-beta pruning.</li>
                  <li>Q-values are cached in JSON to avoid recomputation.</li>
                  <li>Efficient board cloning is used to simulate possible outcomes.</li>
                </ul>
              </li>
              <li><strong>Code Architecture:</strong> Modular Python codebase using classes for Board, Player, Bot, Game, and UI. Pygame is used for rendering.</li>
            </ul>
              </CardContent>
            </Card>

        {/* Additional Learning Resources */}
        <Card className="mb-8">
              <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-6 h-6 text-green-600" />
              📚 Additional Learning Resources
                </CardTitle>
              </CardHeader>
          <CardContent className="text-slate-700 leading-relaxed">
            <h3 className="text-lg font-semibold mb-3">📖 Academic Foundations:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><em>Videgain & Sanchez (2021)</em> – Performance study of Minimax and RL in turn-based games.</li>
              <li><em>Richard Sutton & Andrew Barto</em> – Reinforcement Learning: An Introduction</li>
            </ul>
            <h3 className="text-lg font-semibold mb-3">💻 Online Courses:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><a href="https://cs50.harvard.edu/ai/" target="_blank" rel="noopener noreferrer">CS50 AI – Harvard's intro to AI (Minimax module)</a></li>
              <li><a href="https://www.deeplearning.ai/programs/" target="_blank" rel="noopener noreferrer">DeepLearning.AI – RL Specialization – Full reinforcement learning pathway</a></li>
            </ul>
            <h3 className="text-lg font-semibold mb-3">💡 Open Source Projects:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><a href="https://github.com/openai/gym" target="_blank" rel="noopener noreferrer">OpenAI Gym</a></li>
              <li><a href="https://github.com/Zeta36/chess-alpha-zero" target="_blank" rel="noopener noreferrer">AlphaZero Implementations</a></li>
            </ul>
            <h3 className="text-lg font-semibold mb-3">👥 Communities & Discussions:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><a href="https://stackoverflow.com/questions" target="_blank" rel="noopener noreferrer">Stack Overflow</a></li>
              <li><a href="https://www.reddit.com/r/MachineLearning/" target="_blank" rel="noopener noreferrer">Reddit – r/MachineLearning</a></li>
              <li><a href="https://www.alignmentforum.org/" target="_blank" rel="noopener noreferrer">AI Alignment Forum</a></li>
            </ul>
              </CardContent>
            </Card>

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

export default LearnPage;
