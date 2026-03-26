import React, { useState } from 'react';
import { X, Delete, Copy, ClipboardPaste } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2000);
  };

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleCalculate = () => {
    try {
      const fullEquation = equation + display;
      // Using Function constructor as a safer alternative to eval for simple math
      // In a real app, use a math library or a proper parser
      const result = new Function(`return ${fullEquation.replace(/×/g, '*').replace(/÷/g, '/')}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setShouldReset(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        showStatus('浏览器不支持剪贴板');
        return;
      }
      await navigator.clipboard.writeText(display);
      showStatus('已复制');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showStatus('复制失败');
    }
  };

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard) {
        showStatus('浏览器不支持剪贴板');
        return;
      }
      const text = await navigator.clipboard.readText();
      // Only paste if it's a valid number
      if (!isNaN(Number(text)) && text.trim() !== '') {
        setDisplay(text.trim());
        setShouldReset(true);
        showStatus('已粘贴');
      } else {
        showStatus('无效的数字');
      }
    } catch (err) {
      console.error('Failed to paste: ', err);
      showStatus('粘贴失败: 权限不足');
    }
  };

  const buttons = [
    { label: <Copy size={16} />, action: handleCopy, className: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300', title: '复制' },
    { label: <ClipboardPaste size={16} />, action: handlePaste, className: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300', title: '粘贴' },
    { label: 'C', action: handleClear, className: 'text-orange-600 col-span-2' },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '-', action: () => handleOperator('-'), className: 'text-orange-600' },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '+', action: () => handleOperator('+'), className: 'text-orange-600' },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '÷', action: () => handleOperator('/'), className: 'text-orange-600' },
    { label: '0', action: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', action: () => handleNumber('.') },
    { label: '×', action: () => handleOperator('*'), className: 'text-orange-600' },
    { label: '⌫', action: handleBackspace, className: 'text-orange-600' },
    { label: '=', action: handleCalculate, className: 'bg-orange-600 text-white col-span-3' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-72 overflow-hidden select-none">
      <div className="bg-neutral-900 p-6 text-right">
        <div className="flex justify-between items-center mb-2">
          <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">计算器</span>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="text-neutral-500 text-xs h-4 mb-1 font-mono">{equation}</div>
        <div className="text-white text-3xl font-bold truncate font-mono relative">
          {display}
          {status && (
            <div className="absolute inset-0 bg-neutral-900/90 flex items-center justify-center text-xs text-orange-400 font-bold animate-in fade-in zoom-in duration-200">
              {status}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 grid grid-cols-4 gap-2 bg-neutral-50">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            title={btn.title}
            className={`
              h-12 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center
              ${btn.className || 'bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200 shadow-sm'}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
