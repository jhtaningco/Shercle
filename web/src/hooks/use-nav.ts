'use client';

import type { NavItem } from '@/types';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useFilteredNavItems(items: NavItem[]) {
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile) {
          setRole(profile.role);
        }
      }
    }
    fetchRole();
  }, []);

  // If role is undefined/null (e.g., initial load or not logged in), 
  // we still want to show items that don't have strict access requirements.
  const currentRole = role || 'guest';

  return items.filter((item) => {
    if (item.access?.role) {
      if (item.access.role === 'cicto') return currentRole === 'cicto';
      if (item.access.role === 'cdrrmo') return currentRole === 'cdrrmo';
      if (item.access.role === 'cswd') return currentRole === 'cswd';
      if (item.access.role === 'barangay') return currentRole === 'barangay';
      
      // Default fallback if role is set but doesn't match above logic
      return currentRole === item.access.role;
    }
    return true; // if no specific role requirement, show it (or hide by default? Let's show by default if no role specified, we'll explicitly tag things in config)
  });
}
