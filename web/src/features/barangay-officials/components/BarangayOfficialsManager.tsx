'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Barangay, BarangayOfficial, District } from '@/types/barangay';
import { IconPlus, IconUserEdit } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BarangayOfficialsTable } from './BarangayOfficialsTable';
import { BarangaySelector } from './BarangaySelector';
import { OfficialConfirmDialog } from './OfficialConfirmDialog';
import { OfficialDialog, type OfficialFormValues } from './OfficialDialog';

interface BarangayOfficialsManagerProps {
  districts: District[];
}

export function BarangayOfficialsManager({
  districts
}: BarangayOfficialsManagerProps) {
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);
  const [officials, setOfficials] = useState<BarangayOfficial[]>([]);
  const [loadingOfficials, setLoadingOfficials] = useState(false);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<BarangayOfficial | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    official: BarangayOfficial | null;
    mode: 'delete' | 'deactivate' | 'activate';
  }>({ open: false, official: null, mode: 'delete' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOfficials = useCallback(async (barangayId: string) => {
    setLoadingOfficials(true);
    try {
      const res = await fetch(`/api/barangay-officials?barangay_id=${barangayId}`);
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
    if (selectedBarangay) {
      fetchOfficials(selectedBarangay.id);
    } else {
      setOfficials([]);
    }
  }, [selectedBarangay, fetchOfficials]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSelectBarangay = (barangay: Barangay) => {
    setSelectedBarangay(barangay);
  };

  const handleAddOfficial = async (values: OfficialFormValues) => {
    if (!selectedBarangay) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/barangay-officials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, barangay_id: selectedBarangay.id, role: 'captain' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to add official');
      setOfficials((prev) => [...prev, data]);
      setAddDialogOpen(false);
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
      const res = await fetch(`/api/barangay-officials/${editingOfficial.id}`, {
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

  const handleToggleStatus = (official: BarangayOfficial) => {
    setConfirmDialog({
      open: true,
      official,
      mode: official.is_active ? 'deactivate' : 'activate'
    });
  };

  const handleDelete = (official: BarangayOfficial) => {
    setConfirmDialog({ open: true, official, mode: 'delete' });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.official) return;
    setActionLoading(true);
    const { official, mode } = confirmDialog;
    try {
      if (mode === 'delete') {
        const res = await fetch(`/api/barangay-officials/${official.id}`, {
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
        const res = await fetch(`/api/barangay-officials/${official.id}`, {
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

  const openEditDialog = (official: BarangayOfficial) => {
    setEditingOfficial(official);
    setEditDialogOpen(true);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  const activeCount = officials.filter((o) => o.is_active).length;

  return (
    <div className='flex h-[calc(100dvh-112px)] overflow-hidden'>
      {/* ── Left Sidebar ──────────────────────────────────────── */}
      <aside className='bg-muted/30 flex w-64 shrink-0 flex-col border-r'>
        <BarangaySelector
          districts={districts}
          selectedBarangayId={selectedBarangay?.id ?? null}
          onSelect={handleSelectBarangay}
        />
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className='flex flex-1 flex-col overflow-hidden'>
        {!selectedBarangay ? (
          /* Empty state — no barangay selected */
          <div className='flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center'>
            <div className='bg-muted flex h-16 w-16 items-center justify-center rounded-full'>
              <IconUserEdit className='text-muted-foreground h-8 w-8' />
            </div>
            <h2 className='text-base font-semibold'>No barangay selected</h2>
            <p className='text-muted-foreground max-w-xs text-sm'>
              Select a barangay from the sidebar to view and manage its officials.
            </p>
          </div>
        ) : (
          <div className='flex flex-1 flex-col overflow-y-auto p-6'>
            {/* ── Header ── */}
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-lg font-semibold'>
                  {selectedBarangay.name.charAt(0) +
                    selectedBarangay.name.slice(1).toLowerCase()}
                </h2>
                <div className='text-muted-foreground mt-0.5 flex items-center gap-2 text-xs'>
                  <span>{selectedBarangay.city_municipality}</span>
                  {selectedBarangay.contact_number && (
                    <>
                      <span>·</span>
                      <span>{selectedBarangay.contact_number}</span>
                    </>
                  )}
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
            <BarangayOfficialsTable
              officials={officials}
              loading={loadingOfficials}
              onEdit={openEditDialog}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      {/* ── Dialogs ──────────────────────────────────────────── */}
      <OfficialDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        barangayName={selectedBarangay?.name ?? ''}
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
        barangayName={selectedBarangay?.name ?? ''}
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
    </div>
  );
}
