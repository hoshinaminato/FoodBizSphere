import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function getChineseTimePeriod(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return '早市';
  if (hour >= 10 && hour < 14) return '午市';
  if (hour >= 14 && hour < 17) return '下午茶';
  if (hour >= 17 && hour < 21) return '晚市';
  return '夜市';
}

export function getDayType(date: Date): 'weekday' | 'weekend' {
  const day = date.getDay();
  return (day === 0 || day === 6) ? 'weekend' : 'weekday';
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header] ?? '';
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPrint() {
  // Ensure the window has focus before printing
  window.focus();
  // Small delay to ensure focus and layout are ready
  setTimeout(() => {
    window.print();
  }, 100);
}
