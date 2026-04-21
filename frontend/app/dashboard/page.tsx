'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/shared/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { formatRelativeDate } from '@/lib/utils';
import styles from './dashboard.module.css';

const statIcons: Record<string, any> = {
  total: ListTodo,
  pending: Clock,
  completed: CheckCircle2,
  overdue: AlertTriangle,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { summary, isLoading } = useAnalytics();

  const stats = summary
    ? [
        { key: 'total', label: 'Total Tasks', value: summary.total, color: 'var(--accent-cyan)' },
        { key: 'pending', label: 'Pending', value: summary.pending, color: 'var(--accent-amber)' },
        { key: 'completed', label: 'Completed', value: summary.completed, color: 'var(--accent-emerald)' },
        { key: 'overdue', label: 'Overdue', value: summary.overdue, color: 'var(--accent-rose)' },
      ]
    : [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className={styles.page}>
          {/* Header */}
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
              <p className={styles.subtext}>Here&apos;s what&apos;s happening with your tasks today.</p>
            </div>
            <Link href="/tasks" className="btn-primary">
              <Zap size={16} />
              New Task
            </Link>
          </motion.div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
                ))
              : stats.map((stat, i) => {
                  const Icon = statIcons[stat.key];
                  return (
                    <motion.div
                      key={stat.key}
                      className={styles.statCard}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                        <Icon size={22} />
                      </div>
                      <div className={styles.statInfo}>
                        <p className={styles.statValue}>{stat.value}</p>
                        <p className={styles.statLabel}>{stat.label}</p>
                      </div>
                    </motion.div>
                  );
                })}
          </div>

          {/* Bottom row */}
          <div className={styles.bottomGrid}>
            {/* Completion Rate */}
            <motion.div
              className={styles.rateCard}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <div className={styles.rateHeader}>
                <TrendingUp size={20} style={{ color: 'var(--accent-cyan)' }} />
                <span>Completion Rate</span>
              </div>
              <div className={styles.rateCircle}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="url(#rateGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(summary?.completionRate || 0) * 3.27} 327`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                  <defs>
                    <linearGradient id="rateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent-cyan)" />
                      <stop offset="100%" stopColor="var(--accent-violet)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className={styles.rateValue}>{summary?.completionRate || 0}%</span>
              </div>
            </motion.div>

            {/* Upcoming */}
            <motion.div
              className={styles.upcomingCard}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className={styles.upcomingHeader}>
                <h3>Upcoming Deadlines</h3>
                <Link href="/tasks" className={styles.viewAll}>
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              {!summary?.upcoming?.length ? (
                <p className={styles.emptyState}>No upcoming deadlines. Nice work! 🎉</p>
              ) : (
                <div className={styles.upcomingList}>
                  {summary.upcoming.map((task) => (
                    <div key={task._id} className={styles.upcomingItem}>
                      <div className={styles.priorityDot} style={{ background: task.priority === 'High' ? 'var(--accent-rose)' : task.priority === 'Medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)' }} />
                      <div className={styles.upcomingInfo}>
                        <p className={styles.upcomingTitle}>{task.title}</p>
                        <p className={styles.upcomingMeta}>{task.subject} · {formatRelativeDate(task.dueDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
