import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../lib/utils';

interface SelectionFieldProps {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (v: string) => void;
  tooltip?: string;
}

export const SelectionField: React.FC<SelectionFieldProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  tooltip 
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-1">
      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</label>
      {tooltip && (
        <Tooltip text={tooltip}>
          <Info size={14} className="text-neutral-400 cursor-help" />
        </Tooltip>
      )}
    </div>
    <div className="flex flex-wrap bg-neutral-100 p-1 rounded-xl gap-1 print:bg-transparent print:p-0 print:border print:border-neutral-200">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex-1 min-w-[60px] py-2 text-xs font-bold rounded-lg transition-all relative",
            value === opt.id 
              ? "bg-white text-orange-600 shadow-sm border-2 border-orange-600 print:border-2 print:border-black print:text-black print:bg-neutral-50" 
              : "text-neutral-400 hover:text-neutral-600 print:text-neutral-300 print:border print:border-transparent"
          )}
        >
          {opt.label}
          {value === opt.id && (
            <div className="hidden print:block absolute -top-1 -right-1 bg-black text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
              ✓
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  tooltip?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  tooltip 
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-1">
      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</label>
      {tooltip && (
        <Tooltip text={tooltip}>
          <Info size={14} className="text-neutral-400 cursor-help" />
        </Tooltip>
      )}
    </div>
    <div className="flex bg-neutral-100 p-1 rounded-xl gap-1 print:bg-transparent print:p-0 print:border print:border-neutral-200">
      <button
        onClick={() => onChange(true)}
        className={cn(
          "flex-1 py-2 text-xs font-bold rounded-lg transition-all relative",
          value === true 
            ? "bg-white text-orange-600 shadow-sm border-2 border-orange-600 print:border-2 print:border-black print:text-black print:bg-neutral-50" 
            : "text-neutral-400 hover:text-neutral-600 print:text-neutral-300 print:border print:border-transparent"
        )}
      >
        是
        {value === true && (
          <div className="hidden print:block absolute -top-1 -right-1 bg-black text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
            ✓
          </div>
        )}
      </button>
      <button
        onClick={() => onChange(false)}
        className={cn(
          "flex-1 py-2 text-xs font-bold rounded-lg transition-all relative",
          value === false 
            ? "bg-white text-orange-600 shadow-sm border-2 border-orange-600 print:border-2 print:border-black print:text-black print:bg-neutral-50" 
            : "text-neutral-400 hover:text-neutral-600 print:text-neutral-300 print:border print:border-transparent"
        )}
      >
        否
        {value === false && (
          <div className="hidden print:block absolute -top-1 -right-1 bg-black text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
            ✓
          </div>
        )}
      </button>
    </div>
  </div>
);
