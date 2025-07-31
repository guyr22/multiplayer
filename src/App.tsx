import React, { useState, useCallback } from 'react';
import { Player, Role } from './types/types';
import { PlayerList } from './components/PlayerList/PlayerList';
import { PlayerSheet } from './components/PlayerSheet/PlayerSheet';
import AddPlayerModal from './components/PlayerList/AddPlayerModal';
import './App.css';
import { useModal } from './hooks/useModal';

// Define available roles
const roles: Role[] = [
  { name: 'Warrior', boostedSkill: 'Strength' },
  { name: 'Rogue', boostedSkill: 'Agility' },
  { name: 'Sage', boostedSkill: 'Intelligence' },
  { name: 'Leader', boostedSkill: 'Charisma' },
  { name: 'Survivor', boostedSkill: 'Endurance' },
  { name: 'Gambler', boostedSkill: 'Luck' },
];

// Initial data for the players
const initialPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'Argorn',
    role: 'Warrior',
    skills: [
      { name: 'Strength', value: 11 },
      { name: 'Agility', value: 6 },
      { name: 'Intelligence', value: 6 },
      { name: 'Charisma', value: 6 },
      { name: 'Endurance', value: 6 },
      { name: 'Luck', value: 6 },
    ],
  },
  {
    id: 'player-2',
    name: 'Legolas',
    role: 'Rogue',
    skills: [
      { name: 'Strength', value: 6 },
      { name: 'Agility', value: 11 },
      { name: 'Intelligence', value: 6 },
      { name: 'Charisma', value: 6 },
      { name: 'Endurance', value: 6 },
      { name: 'Luck', value: 6 },
    ],
  },
];

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(initialPlayers[0]?.id || null);
  const modal = useModal(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<string>(roles[0].name);

  const handleSelectPlayer = (id: string) => {
    setSelectedPlayerId(id);
  };
  
  // Callback to update a player's state in the main players array
  const handleUpdatePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
    );
  }, []);

  const handleAddPlayer = modal.open;
  const handleModalClose = modal.close;

  const handleModalSubmit = (name: string, role: string) => {
    const newId = `player-${players.length + 1}`;
    const roleObj = roles.find(r => r.name === role)!;
    const skills = [
      { name: 'Strength', value: roleObj.boostedSkill === 'Strength' ? 11 : 6 },
      { name: 'Agility', value: roleObj.boostedSkill === 'Agility' ? 11 : 6 },
      { name: 'Intelligence', value: roleObj.boostedSkill === 'Intelligence' ? 11 : 6 },
      { name: 'Charisma', value: roleObj.boostedSkill === 'Charisma' ? 11 : 6 },
      { name: 'Endurance', value: roleObj.boostedSkill === 'Endurance' ? 11 : 6 },
      { name: 'Luck', value: roleObj.boostedSkill === 'Luck' ? 11 : 6 },
    ];
    const newPlayer: Player = {
      id: newId,
      name,
      role,
      skills,
    };
    setPlayers(prev => [...prev, newPlayer]);
    setSelectedPlayerId(newId);
    modal.close();
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || null;

  return (
    <div className="App" dir="rtl">
      <PlayerList 
        players={players} 
        selectedPlayerId={selectedPlayerId} 
        onSelectPlayer={handleSelectPlayer} 
        onAddPlayer={handleAddPlayer}
      />
      <main className="main-content">
        <PlayerSheet 
          player={selectedPlayer}
          onUpdatePlayer={handleUpdatePlayer}
        />
      </main>
      <AddPlayerModal
        open={modal.isOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        roles={roles}
      />
    </div>
  );
}

export default App;