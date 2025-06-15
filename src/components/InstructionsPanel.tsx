import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const InstructionsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="w-4 h-4" />
          Game Instructions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-slate-600">
          <p>1. A checker piece moves one step diagonally forward per turn.</p>
          <p>2. You can capture an opponent's piece by jumping over it diagonally.</p>
          <p>3. Capturing is mandatory if a jump is available.</p>
          <p>4. Multiple captures are allowed in a single turn if possible.</p>
          <p>5. When a piece reaches the opponent's baseline, it is promoted to a KING.</p>
          <p>6. KING pieces can move both forward and backward diagonally.</p>
          <p>7. Red always plays first.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsPanel;
