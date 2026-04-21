'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/shared/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { User, Lock, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', { name });
      updateUser({ ...user!, name: res.data.data.user.name });
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all tasks. This action cannot be undone.')) return;
    try {
      await api.delete('/users/account');
      logout();
      router.push('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className={styles.page}>
          <h1 className={styles.title}>Profile Settings</h1>

          {/* Profile info */}
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.sectionHeader}>
              <User size={20} style={{ color: 'var(--accent-cyan)' }} />
              <h2>Profile Information</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className={styles.form}>
              <div className={styles.formField}>
                <label className="label">Name</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className={styles.formField}>
                <label className="label">Email</label>
                <input className="input-field" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
              </div>
              <button type="submit" className="btn-primary" disabled={savingProfile}>
                <Save size={16} />
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>

          {/* Password */}
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className={styles.sectionHeader}>
              <Lock size={20} style={{ color: 'var(--accent-amber)' }} />
              <h2>Change Password</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className={styles.form}>
              <div className={styles.formField}>
                <label className="label">Current Password</label>
                <input className="input-field" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required minLength={6} />
              </div>
              <div className={styles.formField}>
                <label className="label">New Password</label>
                <input className="input-field" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <button type="submit" className="btn-primary" disabled={savingPassword}>
                <Lock size={16} />
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            className={`${styles.section} ${styles.dangerSection}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className={styles.sectionHeader}>
              <Trash2 size={20} style={{ color: 'var(--accent-rose)' }} />
              <h2>Danger Zone</h2>
            </div>
            <p className={styles.dangerText}>Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="btn-danger" onClick={handleDeleteAccount}>
              <Trash2 size={16} />
              Delete Account
            </button>
          </motion.div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
