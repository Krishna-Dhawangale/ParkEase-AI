import React from 'react';
import { Settings } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export function ComingSoon() {
  return (
    <div className="p-8 h-full flex items-center justify-center">
      <Card className="p-12 flex flex-col items-center text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-gray-400 animate-spin-slow" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500">This module is currently under development. Please check back later!</p>
      </Card>
    </div>
  );
}
