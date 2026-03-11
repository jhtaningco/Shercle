'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CdrrmoOfficial } from '@/types/cdrrmo';
import { IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CdrrmoOfficialsTable } from './CdrrmoOfficialsTable';
import { OfficialConfirmDialog } from './OfficialConfirmDialog';
import { OfficialDialog, type OfficialFormValues } from './OfficialDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export function CdrrmoOfficialsManager() {
  const [officials, setOfficials] = useState<CdrrmoOfficial[]>([]);
  const [loadingOfficials, setLoadingOfficials] = useState(false);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<CdrrmoOfficial | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    official: CdrrmoOfficial | null;
    mode: 'delete' | 'deactivate' | 'activate';
  }>({ open: false, official: null, mode: 'delete' });
  const [verificationModal, setVerificationModal] = useState<{ open: boolean; email: string }>({ open: false, email: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOfficials = useCallback(async () => {
    setLoadingOfficials(true);
    try {
      const res = await fetch(`/api/cdrrmo-officials`);
      if (!res.ok) throw new Error('Failed to fetch officials');
      const data = await res.json();
      setOfficials(data);
    } catch (err) {
      toast.error('Could not load officials. Please try again.');
    } finally {
      setLoadingOfficials(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleAddOfficial = async (values: OfficialFormValues) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/cdrrmo-officials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to add official');
      setOfficials((prev) => [...prev, data]);
      setAddDialogOpen(false);
      setVerificationModal({ open: true, email: values.email });
      toast.success('Official added successfully');
    } catch (err: any) {
      toast.error(err.message ?? 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditOfficial = async (values: OfficialFormValues) => {
    if (!editingOfficial) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cdrrmo-officials/${editingOfficial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to update official');
      setOfficials((prev) =>
        prev.map((o) => (o.id === editingOfficial.id ? data : o))
      );
      setEditDialogOpen(false);
      setEditingOfficial(null);
      toast.success('Official updated successfully');
    } catch (err: any) {
      toast.error(err.message ?? 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = (official: CdrrmoOfficial) => {
    setConfirmDialog({
      open: true,
      official,
      mode: official.is_active ? 'deactivate' : 'activate'
    });
  };

  const handleDelete = (official: CdrrmoOfficial) => {
    setConfirmDialog({ open: true, official, mode: 'delete' });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.official) return;
    setActionLoading(true);
    const { official, mode } = confirmDialog;
    try {
      if (mode === 'delete') {
        const res = await fetch(`/api/cdrrmo-officials/${official.id}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? 'Failed to delete official');
        }
        setOfficials((prev) => prev.filter((o) => o.id !== official.id));
        toast.success(`${official.first_name} ${official.last_name} deleted`);
      } else {
        const isActive = mode === 'activate';
        const res = await fetch(`/api/cdrrmo-officials/${official.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: isActive })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed to update status');
        setOfficials((prev) => prev.map((o) => (o.id === official.id ? data : o)));
        toast.success(
          `${official.first_name} ${official.last_name} ${isActive ? 'activated' : 'deactivated'}`
        );
      }
      setConfirmDialog({ open: false, official: null, mode: 'delete' });
    } catch (err: any) {
      toast.error(err.message ?? 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (official: CdrrmoOfficial) => {
    setEditingOfficial(official);
    setEditDialogOpen(true);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  const activeCount = officials.filter((o) => o.is_active).length;

  return (
    <div className='flex h-[calc(100dvh-112px)] overflow-hidden'>
      {/* ── Main Content ──────────────────────────────────────── */}
      <main className='flex flex-1 flex-col overflow-hidden'>
        <div className='flex flex-1 flex-col overflow-y-auto p-6'>
          {/* ── Header ── */}
          <div className='mb-4 flex items-start justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold'>
                All CDRRMO Officials
              </h2>
              <div className='text-muted-foreground mt-0.5 flex items-center gap-2 text-xs'>
                <span>San Fernando, La Union</span>
                <span>·</span>
                <span>
                  {activeCount} of {officials.length} active
                </span>
              </div>
            </div>
            <Button
              onClick={() => setAddDialogOpen(true)}
              size='sm'
              className='shrink-0'
            >
              <IconPlus className='mr-1.5 h-4 w-4' />
              Add Official
            </Button>
          </div>

          <Separator className='mb-4' />

          {/* ── Table ── */}
          <CdrrmoOfficialsTable
            officials={officials}
            loading={loadingOfficials}
            onEdit={openEditDialog}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* ── Dialogs ──────────────────────────────────────────── */}
      <OfficialDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddOfficial}
        loading={actionLoading}
      />

      <OfficialDialog
        open={editDialogOpen}
        onOpenChange={(val) => {
          setEditDialogOpen(val);
          if (!val) setEditingOfficial(null);
        }}
        official={editingOfficial}
        onSubmit={handleEditOfficial}
        loading={actionLoading}
      />

      <OfficialConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(val) =>
          setConfirmDialog((prev) => ({ ...prev, open: val }))
        }
        official={confirmDialog.official}
        mode={confirmDialog.mode}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
      />

      <Dialog open={verificationModal.open} onOpenChange={(open) => setVerificationModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Created Successfully</DialogTitle>
            <DialogDescription>
              Account created successfully. A verification email has been sent to <span className="font-semibold text-foreground">{verificationModal.email}</span>. The official must verify their email before they can log in. Please also hand over their login credentials to them in person.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button type="button" onClick={() => setVerificationModal(prev => ({ ...prev, open: false }))}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
