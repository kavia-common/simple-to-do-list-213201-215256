import React, { useEffect, useMemo, useState } from 'react';
import { getTodos, saveTodos, addTodo as storageAdd, updateTodo as storageUpdate, deleteTodo as storageDelete, toggleComplete as storageToggle } from '../utils/storage';
import TodoInput from './TodoInput.jsx';
import TodoList from './TodoList.jsx';

/**
 * TodoApp component: manages todos state, loads from storage on mount,
 * persists on change, and orders todos: incomplete first, then newest by createdAt.
 */
export default function TodoApp() {
  const [todos, setTodos] = useState([]);

  // Load from storage on mount
  useEffect(() => {
    setTodos(getTodos());
  }, []);

  // Persist to storage whenever todos change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Derived ordered list: incomplete first, then by createdAt desc
  const orderedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [todos]);

  // Handlers
  const handleAdd = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    // Use local state update for performance; storage is persisted via effect
    setTodos(prev => {
      const now = Date.now();
      // ID generation consistent with storage util
      const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${now}-${Math.random().toString(16).slice(2)}`;
      const newTodo = { id, text: trimmed, completed: false, createdAt: now, updatedAt: now };
      return [newTodo, ...prev];
    });
  };

  const handleToggle = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t));
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleEditSave = (id, newText) => {
    const trimmed = (newText || '').trim();
    if (!trimmed) {
      // If cleared, treat as delete for simplicity
      setTodos(prev => prev.filter(t => t.id !== id));
    } else {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, text: trimmed, updatedAt: Date.now() } : t));
    }
  };

  return (
    <main style={styles.container} aria-label="To-do application">
      <section style={styles.header}>
        <h1 style={styles.title} aria-label="Application title">To-do List</h1>
        <p style={styles.subtitle}>Organize tasks with a clean, modern interface.</p>
      </section>

      <section style={styles.card} aria-label="Create new to-do">
        <TodoInput onAdd={handleAdd} />
      </section>

      <section style={styles.card} aria-label="To-do items">
        <TodoList
          todos={orderedTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEditSave={handleEditSave}
        />
      </section>
    </main>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    marginTop: 8,
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  card: {
    background: 'var(--bg-secondary)',
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    padding: 16,
    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
    marginTop: 16,
  },
};
