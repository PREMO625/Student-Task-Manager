'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/shared/AppLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';
import { BarChart3, Flame } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import styles from './analytics.module.css';

const COLORS = ['#22d3ee', '#8b5cf6', '#f59e0b', '#fb7185', '#34d399', '#6366f1', '#ec4899', '#14b8a6'];

export default function AnalyticsPage() {
  const { summary, charts, isLoading } = useAnalytics();

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className={styles.page}>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.subtitle}>Track your productivity and progress</p>

          {isLoading ? (
            <div className={styles.loadingGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : (
            <>
              {/* Streak */}
              <motion.div
                className={styles.streakCard}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Flame size={28} style={{ color: 'var(--accent-amber)' }} />
                <div>
                  <p className={styles.streakValue}>{charts?.streak || 0} day streak</p>
                  <p className={styles.streakLabel}>Keep completing tasks to maintain your streak!</p>
                </div>
              </motion.div>

              <div className={styles.chartsGrid}>
                {/* Weekly Bar Chart */}
                <motion.div
                  className={styles.chartCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h3>Tasks Completed This Week</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={charts?.weeklyCompleted || []}>
                      <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)' }}
                      />
                      <Bar dataKey="completed" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Status Pie */}
                <motion.div
                  className={styles.chartCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <h3>Pending vs Completed</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={charts?.statusDistribution || []}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {charts?.statusDistribution?.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)' }} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Subject Distribution */}
                <motion.div
                  className={styles.chartCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3>Subject Distribution</h3>
                  <ResponsiveContainer width="100%" height={Math.max(220, (charts?.subjectDistribution?.length || 0) * 40)}>
                    <BarChart data={charts?.subjectDistribution || []} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                      <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Outfit, sans-serif' }} axisLine={false} tickLine={false} width={130} />
                      <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)' }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {charts?.subjectDistribution?.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Priority Distribution */}
                <motion.div
                  className={styles.chartCard}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h3>Priority Breakdown</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={charts?.priorityDistribution || []}
                        dataKey="count"
                        nameKey="priority"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {charts?.priorityDistribution?.map((entry, i) => (
                          <Cell key={i} fill={entry.priority === 'High' ? '#fb7185' : entry.priority === 'Medium' ? '#f59e0b' : '#34d399'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)' }} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
