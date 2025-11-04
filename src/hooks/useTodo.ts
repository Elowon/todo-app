// src/hooks/useTodos.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueAt?: string | null;
  createdAt: string;
};

const STORAGE_KEY = "TODOS_V1";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // load from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw) {
          const parsed: Todo[] = JSON.parse(raw);
          setTodos(parsed);
        }
      } catch (err) {
        console.warn("Failed to load todos", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // persist when todos change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (err) {
        console.warn("Failed to save todos", err);
      }
    })();
  }, [todos]);

  function createTodo(payload: { title: string; description?: string; dueAt?: string | null }) {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: payload.title,
      description: payload.description,
      completed: false,
      dueAt: payload.dueAt ?? null,
      createdAt: new Date().toISOString(),
    };
    setTodos((s) => [newTodo, ...s]);
    return newTodo;
  }

  function updateTodo(id: string, patch: Partial<Todo>) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTodo(id: string) {
    setTodos((s) => s.filter((t) => t.id !== id));
  }

  function toggleComplete(id: string) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  return {
    todos,
    loading,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    setTodos, // exposed for advanced operations (sorting, bulk ops)
  } as const;
}
