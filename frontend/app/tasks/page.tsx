'use client';

import { useState, useCallback, useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/shared/AppLayout';
import { useTasks } from '@/hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, CheckCircle2, Circle, Trash2, Copy,
  ChevronDown, X, Clock, AlertTriangle, Star, BookOpen,
  SlidersHorizontal, Calendar,
} from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import styles from './tasks.module.css';

const views = [
  { key: '', label: 'All Tasks' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'completed', label: 'Completed' },
  { key: 'high-priority', label: 'High Priority' },
];

export default function TasksPage() {
  const [view, setView] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { tasks, pagination, isLoading, createTask, updateTask, deleteTask, toggleTask, duplicateTask, bulkDelete } =
    useTasks({ view, search: debouncedSearch, priority: filterPriority, sortBy, order, page, limit: 20 });

  const handleToggle = async (id: string) => {
    try {
      await toggleTask(id);
      toast.success('Task updated');
    } catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateTask(id);
      toast.success('Task duplicated');
    } catch { toast.error('Failed to duplicate'); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} tasks?`)) return;
    try {
      await bulkDelete(selectedIds);
      setSelectedIds([]);
      toast.success('Tasks deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateSubmit = async (data: any) => {
    try {
      await createTask(data);
      setShowCreateModal(false);
      toast.success('Task created! 🎉');
    } catch { toast.error('Failed to create task'); }
  };

  const handleEditSubmit = async (data: any) => {
    try {
      await updateTask(editTask._id, data);
      setEditTask(null);
      toast.success('Task updated');
    } catch { toast.error('Failed to update task'); }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className={styles.page}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Tasks</h1>
            <div className={styles.headerActions}>
              {selectedIds.length > 0 && (
                <button className="btn-danger" onClick={handleBulkDelete}>
                  <Trash2 size={16} />
                  Delete ({selectedIds.length})
                </button>
              )}
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                New Task
              </button>
            </div>
          </div>

          {/* Views */}
          <div className={styles.viewTabs}>
            {views.map((v) => (
              <button
                key={v.key}
                className={`${styles.viewTab} ${view === v.key ? styles.active : ''}`}
                onClick={() => { setView(v.key); setPage(1); }}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: 42 }}
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-ghost" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              className={styles.filtersRow}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <select className="input-field" style={{ maxWidth: 160 }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select className="input-field" style={{ maxWidth: 160 }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="dueDate">Due Date</option>
                <option value="createdAt">Created</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
              <select className="input-field" style={{ maxWidth: 140 }} value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </motion.div>
          )}

          {/* Task List */}
          <div className={styles.taskList}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 80, marginBottom: 8, borderRadius: 'var(--radius-md)' }} />
              ))
            ) : tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <BookOpen size={40} style={{ color: 'var(--text-muted)' }} />
                <p>No tasks found</p>
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                  <Plus size={16} /> Create Your First Task
                </button>
              </div>
            ) : (
              tasks.map((task, i) => (
                <motion.div
                  key={task._id}
                  className={`${styles.taskCard} ${task.status === 'Completed' ? styles.completed : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <div className={styles.taskLeft}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(task._id)}
                      onChange={() => toggleSelect(task._id)}
                      className={styles.checkbox}
                    />
                    <button className={styles.statusBtn} onClick={() => handleToggle(task._id)}>
                      {task.status === 'Completed' ? (
                        <CheckCircle2 size={22} style={{ color: 'var(--accent-emerald)' }} />
                      ) : (
                        <Circle size={22} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </button>
                    <div className={styles.taskInfo} onClick={() => setEditTask(task)}>
                      <p className={styles.taskTitle}>{task.title}</p>
                      <div className={styles.taskMeta}>
                        <span className={`badge ${task.priority === 'High' ? 'badge-rose' : task.priority === 'Medium' ? 'badge-amber' : 'badge-emerald'}`}>
                          {task.priority}
                        </span>
                        <span className={styles.taskSubject}>{task.subject}</span>
                        <span className={styles.taskDate}>
                          <Calendar size={12} /> {formatRelativeDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.taskActions}>
                    <button className="btn-ghost" onClick={() => handleDuplicate(task._id)} title="Duplicate">
                      <Copy size={15} />
                    </button>
                    <button className="btn-ghost" onClick={() => setEditTask(task)} title="Edit">
                      <SlidersHorizontal size={15} />
                    </button>
                    <button className="btn-ghost" onClick={() => handleDelete(task._id)} title="Delete" style={{ color: 'var(--accent-rose)' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className={styles.pagination}>
              <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className={styles.pageInfo}>Page {page} of {pagination.pages}</span>
              <button className="btn-ghost" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}

          {/* Create / Edit Modal */}
          <AnimatePresence>
            {(showCreateModal || editTask) && (
              <TaskModal
                task={editTask}
                onClose={() => { setShowCreateModal(false); setEditTask(null); }}
                onSubmit={editTask ? handleEditSubmit : handleCreateSubmit}
              />
            )}
          </AnimatePresence>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

// ---- Task Form Modal ----
function TaskModal({ task, onClose, onSubmit }: { task: any; onClose: () => void; onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [subject, setSubject] = useState(task?.subject || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime?.toString() || '');
  const [tags, setTags] = useState(task?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title,
      description: description || undefined,
      subject,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      tags: tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    });
    setLoading(false);
  };

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className="label">Title *</label>
              <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Complete Chapter 5" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className="label">Subject *</label>
              <input className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Mathematics" />
            </div>
            <div className={styles.formField}>
              <label className="label">Priority</label>
              <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className="label">Due Date *</label>
              <input className="input-field" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div className={styles.formField}>
              <label className="label">Est. Time (min)</label>
              <input className="input-field" type="number" min="0" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="e.g. 60" />
            </div>
          </div>
          <div className={styles.formField}>
            <label className="label">Description</label>
            <textarea className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." style={{ resize: 'vertical' }} />
          </div>
          <div className={styles.formField}>
            <label className="label">Tags (comma separated)</label>
            <input className="input-field" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="homework, exam, reading" />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
