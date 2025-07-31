import React, { useState, useEffect } from 'react';
import { Role } from '../../types/types';

interface AddPlayerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, role: string) => void;
  roles: Role[];
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ open, onClose, onSubmit, roles }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(roles[0]?.name || '');

  useEffect(() => {
    if (open) {
      setName('');
      setRole(roles[0]?.name || '');
    }
  }, [open, roles]);

  if (!open) return null;

  // Handler for clicking the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), role);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleOverlayClick}
    >
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'stretch',
      }}>
        <label htmlFor="new-player-name">Enter new player name:</label>
        <input
          id="new-player-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <label htmlFor="new-player-role">Select role:</label>
        <select
          id="new-player-role"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          {roles.map(role => (
            <option key={role.name} value={role.name}>{role.name}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={!name.trim()}>Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayerModal;