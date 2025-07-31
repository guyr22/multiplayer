import React, { useEffect } from 'react';
import { Player } from '../../types/types';
import { usePlayerSkills } from '../../hooks/usePlayerSkills';
import { SkillInput } from '../SkillInput/SkillInput';
import './PlayerSheet.css';

// Roles definition (should match App.tsx)
const roles = [
  { name: 'Warrior', boostedSkill: 'Strength' },
  { name: 'Rogue', boostedSkill: 'Agility' },
  { name: 'Sage', boostedSkill: 'Intelligence' },
  { name: 'Leader', boostedSkill: 'Charisma' },
  { name: 'Survivor', boostedSkill: 'Endurance' },
  { name: 'Gambler', boostedSkill: 'Luck' },
];

interface PlayerSheetProps {
  player: Player | null;
  onUpdatePlayer: (updatedPlayer: Player) => void;
}

export const PlayerSheet: React.FC<PlayerSheetProps> = ({ player: initialPlayer, onUpdatePlayer }) => {
  const { 
    player, 
    setPlayer,
    totalPoints, 
    remainingPoints,
    updateSkill,
    incrementSkill,
    decrementSkill,
    resetSkills,
    randomizeSkills,
    MIN_SKILL_POINTS,
    MAX_SKILL_POINTS,
    MAX_TOTAL_POINTS
  } = usePlayerSkills(initialPlayer || { id: '', name: '', skills: [], role: '' });

  // When the selected player changes from the outside, reset the hook's internal state
  useEffect(() => {
    if (initialPlayer) {
      setPlayer(initialPlayer);
    }
  }, [initialPlayer, setPlayer]);

  // When the hook's internal state changes, notify the parent component
  useEffect(() => {
    if (initialPlayer) { // Only update if there's a player
        onUpdatePlayer(player);
    }
  }, [player, onUpdatePlayer, initialPlayer]);

  if (!initialPlayer) {
    return <div className="player-sheet-container placeholder">Select a player from the list</div>;
  }

  // Find the boosted skill for this player's role
  const boostedSkill = roles.find(r => r.name === player.role)?.boostedSkill;

  return (
    <div className="player-sheet-container">
      <h2 className="player-name">{player.name}</h2>
      <div className="points-summary">
        <p>Total Points: <span className="points-total">{totalPoints} / {MAX_TOTAL_POINTS}</span></p>
        <p>Remaining Points: <span className="points-remaining">{remainingPoints}</span></p>
      </div>
      
      <div className="skills-list">
        {player.skills.map((skill, index) => {
          const isBoosted = skill.name === boostedSkill;
          const minValue = isBoosted ? 11 : MIN_SKILL_POINTS;
          return (
            <SkillInput 
              key={index}
              label={skill.name}
              value={skill.value}
              onDecrement={() => decrementSkill(index)}
              onIncrement={() => incrementSkill(index)}
              onValueChange={(newValue) => updateSkill(index, newValue)}
              isDecrementDisabled={skill.value <= minValue}
              isIncrementDisabled={totalPoints >= MAX_TOTAL_POINTS || skill.value >= MAX_SKILL_POINTS}
            />
          );
        })}
      </div>

      <div className="action-buttons">
          <button onClick={randomizeSkills}>Random 🎲</button>
          <button onClick={resetSkills}>Reset 🔄</button>
      </div>
    </div>
  );
};