import React, { useRef, useState } from 'react';

/**
 * TodoInput: input + add button; Enter adds; trim and ignore empty.
 */
export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd && onAdd(trimmed);
    setValue('');
    // Return focus to input for quick entry
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div style={styles.wrapper}>
      <label htmlFor="new-todo" className="sr-only" aria-hidden="true" style={styles.srOnly}>
        New to-do
      </label>
      <input
        ref={inputRef}
        id="new-todo"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Add a new task..."
        aria-label="Add a new to-do"
        style={styles.input}
      />
      <button
        onClick={submit}
        style={styles.button}
        className="btn"
        aria-label="Add to-do"
      >
        Add
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '1rem',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  },
  button: {
    padding: '12px 16px',
    borderRadius: 10,
    border: 'none',
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 1px, 1px)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};
