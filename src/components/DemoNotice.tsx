import { AlertCircle } from "lucide-react";
import { Card } from "./ui/card";

export const DemoNotice = () => {
  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-blue-50 border-blue-200 max-w-sm z-50 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm mb-1">Demo Mode</h4>
          <p className="text-xs text-gray-700">
            This prototype uses simulated ML analysis. In production, it would integrate real 
            speech-to-text, NLP, and computer vision models for accurate feedback.
          </p>
        </div>
      </div>
    </Card>
  );
};
