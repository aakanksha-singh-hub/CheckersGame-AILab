import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const GameAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-4 h-4" />
          Game Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-medium text-slate-700 mb-2">Performance Metrics</div>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Move Efficiency:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Computation Time:</span>
                <span>--</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-700 mb-2">Algorithm Stats</div>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Minimax Depth:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Q-Table Size:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Learning Rate:</span>
                <span>--</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
