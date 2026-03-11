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
import type { CdrrmoOfficial } from '@/types/cdrrmo';

interface OfficialConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  official: CdrrmoOfficial | null;
  mode: 'delete' | 'deactivate' | 'activate';
  onConfirm: () => Promise<void>;
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

  const isDelete = mode === 'delete';
  const isDeactivate = mode === 'deactivate';

  const title = isDelete
    ? 'Delete Official'
    : isDeactivate
      ? 'Deactivate Official'
      : 'Activate Official';

  const description = isDelete
    ? `Are you sure you want to delete ${official.first_name} ${official.last_name}? This action cannot be undone.`
    : isDeactivate
      ? `Are you sure you want to deactivate ${official.first_name} ${official.last_name}? They will lose access to their account until reactivated.`
      : `Are you sure you want to activate ${official.first_name} ${official.last_name}? They will regain access to their account.`;

  const actionText = isDelete
    ? 'Delete'
    : isDeactivate
      ? 'Deactivate'
      : 'Activate';

  const actionColor =
    isDelete || isDeactivate
      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800';

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
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={actionColor}
            disabled={loading}
          >
            {loading ? 'Processing...' : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
