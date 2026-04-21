'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Task, Pagination } from '@/types';

interface UseTasksOptions {
  view?: string;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          params.set(key, String(value));
        }
      });
      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.data.tasks);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(options)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: any) => {
    const res = await api.post('/tasks', data);
    await fetchTasks();
    return res.data.data.task;
  };

  const updateTask = async (id: string, data: any) => {
    const res = await api.put(`/tasks/${id}`, data);
    await fetchTasks();
    return res.data.data.task;
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    await fetchTasks();
  };

  const toggleTask = async (id: string) => {
    const res = await api.patch(`/tasks/${id}/toggle`);
    await fetchTasks();
    return res.data.data.task;
  };

  const duplicateTask = async (id: string) => {
    const res = await api.post(`/tasks/${id}/duplicate`);
    await fetchTasks();
    return res.data.data.task;
  };

  const bulkDelete = async (ids: string[]) => {
    await api.delete('/tasks/bulk', { data: { ids } });
    await fetchTasks();
  };

  return {
    tasks,
    pagination,
    isLoading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    duplicateTask,
    bulkDelete,
  };
}
