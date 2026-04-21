'use client';

import { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/shared/AppLayout';
import { useTasks } from '@/hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X, CheckCircle2, Circle, Calendar as CalIcon,
  Clock, Tag,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import styles from './calendar.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { tasks, toggleTask } = useTasks({ limit: 200 });

  // Map tasks to date keys
  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach((task) => {
      const key = new Date(task.dueDate).toISOString().split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const handleDayClick = (dateKey: string) => {
    setSelectedDate(dateKey);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask(id);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : [];
  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;

  // Count tasks for the month
  const monthTaskCount = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      count += (tasksByDate[key] || []).length;
    }
    return count;
  }, [tasksByDate, year, month, daysInMonth]);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className={styles.page}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Calendar</h1>
              <p className={styles.subtitle}>{monthTaskCount} tasks this month</p>
            </div>
            <button className="btn-secondary" onClick={goToday}>Today</button>
          </div>

          <div className={styles.calendarCard}>
            <div className={styles.calHeader}>
              <button className={styles.navBtn} onClick={prev}><ChevronLeft size={20} /></button>
              <h2 className={styles.monthTitle}>{MONTHS[month]} {year}</h2>
              <button className={styles.navBtn} onClick={next}><ChevronRight size={20} /></button>
            </div>

            <div className={styles.dayLabels}>
              {DAYS.map((d) => <div key={d} className={styles.dayLabel}>{d}</div>)}
            </div>

            <div className={styles.grid}>
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} className={styles.emptyCell} />;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayTasks = tasksByDate[dateKey] || [];
                const isToday = dateKey === todayKey;
                const isSelected = dateKey === selectedDate;
                const hasOverdue = dayTasks.some((t) => t.status === 'Pending' && new Date(t.dueDate) < today);

                return (
                  <button
                    key={dateKey}
                    className={`${styles.cell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''} ${dayTasks.length > 0 ? styles.hasTasks : ''}`}
                    onClick={() => handleDayClick(dateKey)}
                    aria-label={`${MONTHS[month]} ${day}, ${dayTasks.length} tasks`}
                  >
                    <span className={styles.dayNum}>{day}</span>
                    {dayTasks.length > 0 && (
                      <div className={styles.dotsRow}>
                        {dayTasks.slice(0, 4).map((t) => (
                          <div
                            key={t._id}
                            className={styles.taskDot}
                            style={{
                              background:
                                t.status === 'Completed' ? 'var(--text-muted)' :
                                t.priority === 'High' ? 'var(--accent-rose)' :
                                t.priority === 'Medium' ? 'var(--accent-amber)' :
                                'var(--accent-emerald)',
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {dayTasks.length > 0 && (
                      <span className={styles.taskCount}>{dayTasks.length}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: 'var(--accent-rose)' }} /> High
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: 'var(--accent-amber)' }} /> Medium
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: 'var(--accent-emerald)' }} /> Low
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: 'var(--text-muted)' }} /> Done
              </div>
            </div>
          </div>

          {/* Day Detail Modal */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDate(null)}
              >
                <motion.div
                  className={styles.modal}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.modalHeader}>
                    <div>
                      <h2 className={styles.modalTitle}>
                        <CalIcon size={18} style={{ color: 'var(--accent-cyan)' }} />
                        {selectedDateObj && formatDate(selectedDateObj)}
                      </h2>
                      <p className={styles.modalSubtitle}>
                        {selectedTasks.length === 0
                          ? 'No tasks scheduled'
                          : `${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setSelectedDate(null)}>
                      <X size={20} />
                    </button>
                  </div>

                  {selectedTasks.length === 0 ? (
                    <div className={styles.emptyModal}>
                      <CalIcon size={36} style={{ color: 'var(--text-muted)' }} />
                      <p>No tasks on this day</p>
                      <span>Click &quot;New Task&quot; on the Tasks page to add one.</span>
                    </div>
                  ) : (
                    <div className={styles.modalTaskList}>
                      {selectedTasks.map((task) => (
                        <div key={task._id} className={`${styles.modalTask} ${task.status === 'Completed' ? styles.modalTaskDone : ''}`}>
                          <button className={styles.toggleBtn} onClick={() => handleToggle(task._id)}>
                            {task.status === 'Completed' ? (
                              <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)' }} />
                            ) : (
                              <Circle size={20} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </button>
                          <div className={styles.modalTaskInfo}>
                            <p className={styles.modalTaskTitle}>{task.title}</p>
                            <div className={styles.modalTaskMeta}>
                              <span className={`badge ${
                                task.priority === 'High' ? 'badge-rose' :
                                task.priority === 'Medium' ? 'badge-amber' : 'badge-emerald'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={styles.modalTaskSubject}>{task.subject}</span>
                              {task.estimatedTime && (
                                <span className={styles.modalTaskTime}>
                                  <Clock size={12} /> {task.estimatedTime}m
                                </span>
                              )}
                            </div>
                            {task.tags.length > 0 && (
                              <div className={styles.modalTaskTags}>
                                {task.tags.map((tag) => (
                                  <span key={tag} className={styles.tag}>
                                    <Tag size={10} /> {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
