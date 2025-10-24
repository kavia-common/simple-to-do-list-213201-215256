import React, { useEffect, useRef, useState } from 'react';

/**
 * TodoItem: checkbox to toggle completion, inline text edit with save/cancel using Enter/Esc, delete button.
 */
export default function TodoItem({ todo, onToggle, onDelete, onEditSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // Keep draft in sync if prop changes externally
    setDraft(todo.text);
  }, [todo.text]);

  const startEdit = () => setIsEditing(true);

  const commitEdit = () => {
    const trimmed = (draft || '').trim();
    if (trimmed !== todo.text) {
      onEditSave && onEditSave(trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraft(todo.text);
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div style={{ ...styles.item, ...(todo.completed ? styles.completed : {}) }}>
      <div style={styles.left}>
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={onToggle}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          style={styles.checkbox}
        />
        {!isEditing ? (
          <button
            onClick={startEdit}
            style={styles.textButton}
            aria-label={`Edit to-do: ${todo.text}`}
            title="Click to edit"
          >
            <span style={styles.text} aria-live="polite">
              {todo.text}
            </span>
          </button>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={commitEdit}
            aria-label="Edit to-do text"
            style={styles.editInput}
          />
        )}
      </div>
      <div style={styles.actions}>
        {isEditing ? (
          <>
            <button onClick={commitEdit} style={styles.secondaryBtn} aria-label="Save to-do edit">Save</button>
            <button onClick={cancelEdit} style={styles.tertiaryBtn} aria-label="Cancel to-do edit">Cancel</button>
          </>
        ) : (
          <button onClick={onDelete} style={styles.deleteBtn} aria-label={`Delete to-do: ${todo.text}`}>Delete</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: '10px 12px',
    transition: 'background 0.2s ease, border-color 0.2s ease',
  },
  completed: {
    opacity: 0.8,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
  },
  textButton: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'text',
    flex: 1,
    minWidth: 0,
  },
  text: {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    wordBreak: 'break-word',
  },
  editInput: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '1rem',
  },
  actions: {
    display: 'flex',
    gap: 8,
    marginLeft: 8,
  },
  secondaryBtn: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  tertiaryBtn: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'transparent',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: '#EF4444',
    color: '#ffffff',
    cursor: 'pointer',
  },
};
