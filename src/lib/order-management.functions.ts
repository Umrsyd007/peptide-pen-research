import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { hasOrderManagementAccess } from './order-summary';

export const getOrderManagementAccess = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth]).handler(async ({ context }) => {
    const { data, error } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId);
    if (error) throw new Error('Unable to check order access');
    return { allowed: hasOrderManagementAccess(data ?? []) };
  });

export const listManagedOrders = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth]).handler(async ({ context }) => {
    const { data: roles, error: roleError } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId);
    if (roleError) throw new Error('Unable to check order access');
    if (!hasOrderManagementAccess(roles ?? [])) return { allowed: false as const, orders: [] };
    // Ordinary reads use the caller's RLS client, never a privileged client.
    const { data, error } = await context.supabase.from('orders')
      .select('id,order_number,email,status,total,currency,ship_name,ship_address1,ship_address2,ship_city,ship_region,ship_postal,ship_country,created_at,ai_summary,ai_summary_status,order_items(name,variant,qty,price)')
      .order('created_at', { ascending: false }).limit(100);
    if (error) throw new Error('Unable to load orders');
    return { allowed: true as const, orders: data ?? [] };
  });