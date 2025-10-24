import React from 'react';
import TodoItem from './TodoItem.jsx';

/**
 * TodoList: renders list of items with empty state.
 */
export default function TodoList({ todos, onToggle, onDelete, onEditSave }) {
  if (!todos || todos.length === 0) {
    return (
      <div role="status" aria-live="polite" style={styles.empty}>
        No to-dos yet. Add your first task above!
      </div>
    );
  }

  return (
    <ul style={styles.list} aria-label="To-do list">
      {todos.map(todo => (
        <li key={todo.id} style={styles.listItem}>
          <TodoItem
            todo={todo}
            onToggle={() => onToggle && onToggle(todo.id)}
            onDelete={() => onDelete && onDelete(todo.id)}
            onEditSave={(text) => onEditSave && onEditSave(todo.id, text)}
          />
        </li>
      ))}
    </ul>
  );
}

const styles = {
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  listItem: {
    margin: 0,
    padding: 0,
  },
  empty: {
    padding: '16px',
    borderRadius: 10,
    border: '1px dashed var(--border-color)',
    color: 'var(--text-primary)',
    background: 'var(--bg-primary)',
    textAlign: 'center',
  },
};
