'use client';

import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Modal = ({ isOpen, onClose, title, message, type = 'success' }: ModalProps) => {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle className="text-green-500 w-12 h-12" />,
    error: <AlertCircle className="text-red-500 w-12 h-12" />,
    info: <Info className="text-blue-500 w-12 h-12" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {iconMap[type]}
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <div className="bg-muted/30 p-4 flex justify-center">
          <Button onClick={onClose} className="min-w-[120px]">
            ตกลง
          </Button>
        </div>
      </div>
    </div>
  );
};
