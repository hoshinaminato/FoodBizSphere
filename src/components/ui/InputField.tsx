import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { cn } from '../../lib/utils';

export const InputField = ({ 
  label, 
  value, 
  onChange, 
  type = "number", 
  suffix, 
  tooltip,
  placeholder,
  readOnly = false
}: { 
  label: string; 
  value: number | string; 
  onChange?: (val: any) => void; 
  type?: string; 
  suffix?: string;
  tooltip?: string;
  placeholder?: string;
  readOnly?: boolean;
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
    <div className="relative">
      <input
        type={type}
        value={type === "number" && value === 0 ? "" : (value ?? "")}
        onChange={(e) => {
          if (type === "number") {
            const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
            onChange?.(isNaN(val) ? 0 : val);
          } else {
            onChange?.(e.target.value);
          }
        }}
        readOnly={readOnly}
        placeholder={placeholder || (type === "number" ? "0" : "")}
        className={cn(
          "w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none print:hidden",
          readOnly && "bg-neutral-50 text-neutral-500 font-medium"
        )}
      />
      {/* Print-only value display */}
      <div className="hidden print:block w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 font-bold">
        {value}{suffix}
      </div>
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium print:hidden">
          {suffix}
        </span>
      )}
    </div>
  </div>
);
