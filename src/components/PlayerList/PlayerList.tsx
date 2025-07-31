import React from 'react';
import { Player } from '../../types/types';
import './PlayerList.css';

interface PlayerListProps {
  players: Player[];
  selectedPlayerId: string | null;
  onSelectPlayer: (id: string) => void;
  onAddPlayer: () => void; // new prop
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, selectedPlayerId, onSelectPlayer, onAddPlayer }) => {
  return (
    <div className="player-list-container">
      <h3>Players</h3>
      <ul className="player-list">
        {players.map((player) => (
          <li
            key={player.id}
            className={`player-item ${player.id === selectedPlayerId ? 'active' : ''}`}
            onClick={() => onSelectPlayer(player.id)}
          >
            {player.name} <span style={{color: '#888', fontSize: '0.9em'}}>({player.role})</span>
          </li>
        ))}
      </ul>
      <button className="add-player-button" onClick={onAddPlayer} style={{ marginTop: '1rem', width: '100%' }}>
        Add Player
      </button>
    </div>
  );
};
