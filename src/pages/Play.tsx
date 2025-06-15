import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Brain, User, RotateCcw, Play, FlaskConical } from "lucide-react";
import { CheckersGame } from "@/components/CheckersGame";
import ResearchPanel from "@/components/ResearchPanel";
import InstructionsPanel from "@/components/InstructionsPanel";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const PlayPage = () => {
  const [opponent, setOpponent] = useState("human");
  const [minimaxDepth, setMinimaxDepth] = useState(2);
  const [showVisualization, setShowVisualization] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const opponentOptions = [
    { value: "human", label: "Human vs Human" },
    { value: "minimax", label: "Human vs Minimax" },
    { value: "rl", label: "Human vs RL Bot" },
    { value: "auto", label: "Minimax vs RL (Auto)" }
  ];

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
  };

  const getMode1 = () => {
    if (opponent === "human") return "human";
    if (opponent === "minimax") return "human";
    if (opponent === "rl") return "human";
    return "minimax";
  };

  const getMode2 = () => {
    if (opponent === "human") return "human";
    if (opponent === "minimax") return "minimax";
    if (opponent === "rl") return "rl";
    return "rl";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskConical className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Checkers AI Lab</h1>
          </div>
          <p className="text-xl text-slate-600">Research Platform: Comparing Minimax & Q-Learning Algorithms</p>
          <div className="text-sm text-slate-500 mt-2">
            Interactive Game Environment for AI Strategy Analysis
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Controls */}
          <div className="lg:col-span-1 space-y-8">
            <InstructionsPanel />

            <Card>
              <CardHeader>
                <CardTitle>Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Algorithm Pairing</Label>
                  <Select value={opponent} onValueChange={setOpponent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select opponent" />
                    </SelectTrigger>
                    <SelectContent>
                      {opponentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(opponent === "minimax" || opponent === "auto") && (
                  <div className="space-y-2">
                    <Label>Minimax Depth: {minimaxDepth}</Label>
                    <Slider
                      value={[minimaxDepth]}
                      onValueChange={(value) => setMinimaxDepth(value[0])}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="visualization"
                    checked={showVisualization}
                    onCheckedChange={setShowVisualization}
                  />
                  <Label htmlFor="visualization">Show Algorithm Visualization</Label>
                </div>

                <div className="flex space-x-4">
                  <Button
                    className="flex-1"
                    onClick={startGame}
                    disabled={gameStarted}
                  >
                    Start Game
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetGame}
                    disabled={!gameStarted}
                  >
                    Reset Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Board */}
          <div className="lg:col-span-2">
            {gameStarted ? (
              <CheckersGame
                mode1={getMode1()}
                mode2={getMode2()}
                minimaxDepth={minimaxDepth}
                showVisualization={showVisualization}
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <p className="text-lg">Click "Start Game" to begin playing</p>
                </div>
              </Card>
            )}
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

export default PlayPage;
