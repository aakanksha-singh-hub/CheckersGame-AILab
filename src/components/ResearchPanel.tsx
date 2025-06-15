import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const ResearchPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-4 h-4" />
          Research Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-medium text-slate-700 mb-2">Minimax Algorithm</div>
            <p className="text-slate-600">
              Uses alpha-beta pruning for strategic depth. Evaluates game states and makes optimal moves based on a predefined evaluation function.
            </p>
          </div>
          <div>
            <div className="font-medium text-slate-700 mb-2">Q-Learning</div>
            <p className="text-slate-600">
              Reinforcement learning approach that learns optimal strategies through experience. Uses a Q-table to store state-action values.
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-medium text-blue-800 mb-1">Research Objective</div>
            <p className="text-xs text-blue-700">
              This platform enables comparative analysis of traditional game tree search algorithms 
              versus modern machine learning approaches in strategic decision-making environments.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchPanel;
