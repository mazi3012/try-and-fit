"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingBag, ShieldCheck, Clock, Search, CheckCircle2, XCircle, MoreVertical, Filter } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buyer" | "seller" | "admin">("all");
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const loadData = async () => {
    try {
      // Fetch all profiles
      const { data: pData } = await supabase.from('profiles').select('*');
      if (pData) setProfiles(pData as UserProfile[]);

      // Fetch pending applications
      const { data: aData } = await supabase
        .from('seller_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (aData) setApplications(aData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveSeller = async (userId: string, applicationId: string) => {
    try {
      // 1. Update application status
      await supabase.from('seller_applications').update({ status: 'approved' }).eq('id', applicationId);
      // 2. Update profile status and role
      await supabase.from('profiles').update({ 
        role: 'seller', 
        seller_status: 'approved' 
      }).eq('id', userId);
      
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSeller = async (userId: string, applicationId: string) => {
    try {
      await supabase.from('seller_applications').update({ status: 'rejected' }).eq('id', applicationId);
      await supabase.from('profiles').update({ seller_status: 'rejected' }).eq('id', userId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesFilter = filter === 'all' || p.role === filter;
    const matchesSearch = !search || 
      p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Admin Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: profiles.length, icon: <Users className="text-blue-500" /> },
          { label: "Active Sellers", val: profiles.filter(p => p.role === 'seller' && p.seller_status === 'approved').length, icon: <ShieldCheck className="text-green-500" /> },
          { label: "Pending Verification", val: applications.filter(a => a.status === 'pending').length, icon: <Clock className="text-amber-500" /> },
          { label: "Total Products", val: "—", icon: <ShoppingBag className="text-purple-500" /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">{s.label}</span>
              <div className="h-8 w-8 rounded-lg bg-[#F7F7F7] flex items-center justify-center">{s.icon}</div>
            </div>
            <p className="text-2xl font-black text-[#111]">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification Portal (Pending Applications) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#111] uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock size={14} className="text-amber-500" /> Pending Requests
            </h3>
            {applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="h-5 w-5 rounded-full bg-brand text-[9px] font-black text-white flex items-center justify-center">
                {applications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {applications.filter(a => a.status === 'pending').map(app => (
              <div key={app.id} className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[#111] uppercase tracking-tight">{app.store_name}</h4>
                    <p className="text-[10px] text-[#888] font-medium">{app.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveSeller(app.user_id, app.id)}
                    className="flex-1 h-9 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={12} /> Approve
                  </button>
                  <button 
                    onClick={() => handleRejectSeller(app.user_id, app.id)}
                    className="flex-1 h-9 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
            {applications.filter(a => a.status === 'pending').length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center bg-white border border-dashed border-black/10 rounded-2xl opacity-60">
                <CheckCircle2 size={24} className="text-green-500 mb-2" />
                <p className="text-[10px] font-black text-[#888] uppercase tracking-widest">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* User Management Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xs font-black text-[#111] uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={14} className="text-brand" /> User Management
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc]" />
                <input 
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-48 bg-white border border-black/5 rounded-xl pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                />
              </div>
              <div className="relative group">
                <button className="h-10 px-3 flex items-center justify-center gap-2 bg-white border border-black/5 rounded-xl text-xs font-black uppercase tracking-widest text-[#888]">
                  <Filter size={14} /> {filter}
                </button>
                <div className="absolute right-0 mt-1 w-32 bg-white border border-black/5 rounded-xl shadow-xl p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-10">
                  {["all", "buyer", "seller", "admin"].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors",
                        filter === f ? "bg-brand text-white" : "hover:bg-[#F7F7F7] text-[#888]"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-[32px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-[#F7F7F7]/50">
                  <th className="px-6 py-4 text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">User</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-[#888] uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F7F7]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-xs">
                          {p.full_name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#111] uppercase tracking-tight">{p.full_name || "Guest"}</p>
                          <p className="text-[9px] text-[#bbb] font-medium font-mono">{p.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        p.role === 'admin' ? "bg-purple-100 text-purple-600" :
                        p.role === 'seller' ? "bg-blue-100 text-blue-600" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {p.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {p.seller_status === 'approved' ? <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> :
                         p.seller_status === 'pending' ? <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> :
                         <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                        <span className="text-[9px] font-black text-[#888] uppercase tracking-widest">
                          {p.seller_status || "n/a"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[#F7F7F7] text-[#ccc] hover:text-[#111] transition-all">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
