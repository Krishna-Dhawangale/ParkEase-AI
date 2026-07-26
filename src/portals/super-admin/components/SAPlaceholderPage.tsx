import { Wrench } from 'lucide-react';
import { SAPageHeader } from './SAPageHeader';

interface Props {
  title: string;
  description: string;
}

export function SAPlaceholderPage({ title, description }: Props) {
  return (
    <div className="space-y-6">
      <SAPageHeader 
        title={title}
        description={description}
      />
      
      <div className="min-h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 text-center p-8">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Wrench className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Module Under Construction</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          The {title} interface is part of a future deployment phase. Development for this module has not been fully implemented yet.
        </p>
      </div>
    </div>
  );
}
