//
// Local storage utility functions for todos
// Uses key 'todos' and safely handles JSON parsing and persistence.
//

const STORAGE_KEY = 'todos';

// Fallback UUID generator if crypto.randomUUID is not available
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: ensure high likelihood of uniqueness
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
export function getTodos() {
  /** Retrieve todos from localStorage with safe parsing and default to [] */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    // If parsing fails, reset to empty array
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveTodos(todos) {
  /** Persist given todos array to localStorage. No-op on failure. */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos || []));
  } catch (e) {
    // Ignore write errors (e.g., quota exceeded)
  }
}

// PUBLIC_INTERFACE
export function addTodo(text) {
  /** Add a new todo with generated id; returns updated todos array. */
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return getTodos();
  }
  const todos = getTodos();
  const newTodo = {
    id: generateId(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const next = [newTodo, ...todos];
  saveTodos(next);
  return next;
}

// PUBLIC_INTERFACE
export function updateTodo(id, updates) {
  /** Update a todo by id with provided fields; returns updated todos array. */
  const todos = getTodos();
  const next = todos.map(t =>
    t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
  );
  saveTodos(next);
  return next;
}

// PUBLIC_INTERFACE
export function deleteTodo(id) {
  /** Delete a todo by id; returns updated todos array. */
  const todos = getTodos();
  const next = todos.filter(t => t.id !== id);
  saveTodos(next);
  return next;
}

// PUBLIC_INTERFACE
export function toggleComplete(id) {
  /** Toggle the completed state of a todo by id; returns updated todos array. */
  const todos = getTodos();
  const next = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
  );
  saveTodos(next);
  return next;
}
