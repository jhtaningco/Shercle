'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import type { BarangayOfficial } from '@/types/barangay';

interface OfficialConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  official: BarangayOfficial | null;
  mode: 'delete' | 'deactivate' | 'activate';
  onConfirm: () => void;
  loading?: boolean;
}

export function OfficialConfirmDialog({
  open,
  onOpenChange,
  official,
  mode,
  onConfirm,
  loading = false
}: OfficialConfirmDialogProps) {
  if (!official) return null;

  const fullName = [official.first_name, official.last_name]
    .filter(Boolean)
    .join(' ');

  const config = {
    delete: {
      title: `Delete ${fullName}?`,
      description:
        'This action cannot be undone. This will permanently remove this official from the system.',
      action: 'Delete',
      actionClassName: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    },
    deactivate: {
      title: `Deactivate ${fullName}?`,
      description: `${fullName} will be marked as inactive and will no longer have active access. You can reactivate them at any time.`,
      action: 'Deactivate',
      actionClassName: 'bg-orange-600 text-white hover:bg-orange-700'
    },
    activate: {
      title: `Activate ${fullName}?`,
      description: `${fullName} will be marked as active and will regain access to the system.`,
      action: 'Activate',
      actionClassName: ''
    }
  };

  const { title, description, action, actionClassName } = config[mode];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={actionClassName}
          >
            {loading ? 'Processing...' : action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
