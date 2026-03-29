'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BookingStatus } from '@/lib/data/requests';
import { handleRequestAction } from '@/app/actions/mentor';

interface StatusButtonProps {
  requestId: string;
  status: BookingStatus;
  label: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
  onSuccess?: () => void;
}

export function StatusButton({ 
  requestId, 
  status, 
  label, 
  variant,
  onSuccess
}: StatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await handleRequestAction(requestId, status);
      if (result.success) {
        onSuccess?.();
      }
    } catch (err) {
      setError('Update failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-auto">
      <Button 
        onClick={handleClick}
        variant={variant} 
        size="sm" 
        className="w-full md:w-auto relative"
        disabled={isLoading}
      >
        {isLoading ? '...' : label}
      </Button>
      {error && <p className="text-[10px] text-red-500 mt-1 absolute">{error}</p>}
    </div>
  );
}
