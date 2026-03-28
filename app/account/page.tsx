"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, Shield, Camera, LogOut, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getProfile, getImageUrl, uploadImage, updateProfile } from "@/lib/supabase-api";
import { createClient } from "@/utils/supabase/client";
import { Dropzone } from "@/components/ui/dropzone";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const supabase = createClient();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const loadProfile = async () => {
    try {
      const p = await getProfile();
      if (p) {
        setProfile(p);
        setFullName(p.full_name || "");
        setPhone(p.phone || "");
        if (p.base_avatar_url) {
          const url = await getImageUrl(p.base_avatar_url, 'user-images');
          setAvatarUrl(url);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    setError("");
    try {
      await updateProfile({
        full_name: fullName,
        phone: phone,
      });
      await loadProfile();
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return;
    setUpdating(true);
    try {
      const path = await uploadImage(file, 'user-images');
      await updateProfile({ base_avatar_url: path });
      await loadProfile();
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={40} className="text-[#ccc]" />
        <p className="text-sm font-bold text-[#888] uppercase tracking-widest">Please sign in to view your profile</p>
        <button onClick={() => window.location.href = "/auth/login"} className="btn-primary px-8">Sign In</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Col: Avatar & Status */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white border border-black/5 rounded-[32px] p-6 shadow-sm flex flex-col items-center">
            <div className="relative group w-40 h-40 mb-4">
              <div className="w-full h-full rounded-[24px] overflow-hidden bg-[#F7F7F7] border-4 border-white shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-brand text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all border-4 border-white">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)} />
              </label>
            </div>
            
            <h2 className="text-xl font-black text-[#111] uppercase tracking-tight text-center">
              {profile.full_name || "New User"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 bg-brand/10 px-3 py-1 rounded-full">
              <Shield size={10} className="text-brand" />
              <span className="text-[9px] font-black text-brand uppercase tracking-widest">{profile.role}</span>
            </div>

            {/* Seller Status Badge */}
            {profile.role === 'seller' && (
              <div className={cn(
                "mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border w-full justify-center",
                profile.seller_status === 'approved' ? "bg-green-50 border-green-100 text-green-600" :
                profile.seller_status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                "bg-red-50 border-red-100 text-red-600"
              )}>
                {profile.seller_status === 'approved' ? <CheckCircle2 size={14} /> : 
                 profile.seller_status === 'pending' ? <Clock size={14} /> : <AlertCircle size={14} />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {profile.seller_status === 'approved' ? "Verified Seller" : 
                   profile.seller_status === 'pending' ? "Under Verification" : "Auth Failed"}
                </span>
              </div>
            )}
            
            <button 
              onClick={handleSignOut}
              className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#888] uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>

          {profile.seller_status === 'pending' && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-amber-600 leading-tight uppercase tracking-tight">
                Your seller account is under verification... our team will verify and update you soon.
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Details & Forms */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-[#111] uppercase tracking-[0.2em]">Profile Details</h3>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-2">
                    <UserIcon size={12} /> Full Name
                  </label>
                  {editMode ? (
                    <input 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-11 bg-[#F7F7F7] border border-black/5 rounded-xl px-4 text-xs font-bold"
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#111]">{profile.full_name || "—"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-2">
                    <Phone size={12} /> Phone Number
                  </label>
                  {editMode ? (
                    <input 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 bg-[#F7F7F7] border border-black/5 rounded-xl px-4 text-xs font-bold"
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#111]">{profile.phone || "—"}</p>
                  )}
                </div>
              </div>

              {editMode && (
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="w-full h-12 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand/90 transition-all disabled:opacity-50 shadow-lg shadow-brand/10"
                >
                  {updating ? "Saving Changes..." : "Save Profile"}
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats or Actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
              <p className="text-[9px] font-black text-[#888] uppercase tracking-widest mb-1">Shopping</p>
              <h4 className="text-xs font-black text-[#111] uppercase mb-4">Your Recent Orders</h4>
              <button onClick={() => window.location.href='/wardrobe'} className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline">View Wardrobe</button>
            </div>
            {profile.role === 'seller' && profile.seller_status === 'approved' && (
              <div className="bg-[#111] text-white rounded-2xl p-5 shadow-sm">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Business</p>
                <h4 className="text-xs font-black text-white uppercase mb-4">Seller Dashboard</h4>
                <button onClick={() => window.location.href='/seller/dashboard'} className="text-[10px] font-black text-brand uppercase tracking-widest hover:text-white transition-colors">Manage Products</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
