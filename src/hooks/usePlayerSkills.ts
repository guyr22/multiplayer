import { useState, useMemo, useCallback } from 'react';
import { Player, Skill } from '../types/types';

// Constants for game rules
const MIN_SKILL_POINTS = 6;
const MAX_SKILL_POINTS = 30;

// Roles definition (should match App.tsx)
const roles = [
  { name: 'Warrior', boostedSkill: 'Strength' },
  { name: 'Rogue', boostedSkill: 'Agility' },
  { name: 'Sage', boostedSkill: 'Intelligence' },
  { name: 'Leader', boostedSkill: 'Charisma' },
  { name: 'Survivor', boostedSkill: 'Endurance' },
  { name: 'Gambler', boostedSkill: 'Luck' },
];

function getRandomTotalPoints() {
  return Math.floor(Math.random() * 5) + 85; // 85, 86, 87, 88, or 89
}

export const usePlayerSkills = (initialPlayer: Player) => {
  const [MAX_TOTAL_POINTS] = useState(getRandomTotalPoints());
  const [player, setPlayer] = useState<Player>(initialPlayer);

  // Find the boosted skill for this player's role
  const boostedSkill = roles.find(r => r.name === player.role)?.boostedSkill;
  const getMinForSkill = (skillName: string) =>
    skillName === boostedSkill ? 11 : MIN_SKILL_POINTS;

  // Memoized calculation for total points to prevent re-calculation on every render
  const totalPoints = useMemo(() => {
    return player.skills.reduce((sum, skill) => sum + skill.value, 0);
  }, [player.skills]);

  const remainingPoints = MAX_TOTAL_POINTS - totalPoints;

  // The core function to update a skill's value with all validation logic
  const updateSkill = useCallback((skillIndex: number, newValue: number) => {
    const currentSkill = player.skills[skillIndex];
    if (!currentSkill) return;

    // 1. Clamp value between individual skill min/max
    const minForThisSkill = getMinForSkill(currentSkill.name);
    let validatedValue = Math.max(minForThisSkill, Math.min(newValue, MAX_SKILL_POINTS));

    // 2. Check if the change exceeds the total available points
    const difference = validatedValue - currentSkill.value;
    if (difference > 0 && difference > remainingPoints) {
      validatedValue = currentSkill.value + remainingPoints;
      // Clamp again in case remainingPoints is negative
      validatedValue = Math.max(minForThisSkill, Math.min(validatedValue, MAX_SKILL_POINTS));
    }

    const newSkills = [...player.skills];
    newSkills[skillIndex] = { ...newSkills[skillIndex], value: validatedValue };
    setPlayer({ ...player, skills: newSkills });

  }, [player, remainingPoints, boostedSkill]);

  const incrementSkill = useCallback((skillIndex: number) => {
    if (totalPoints < MAX_TOTAL_POINTS) {
      const currentSkill = player.skills[skillIndex];
      if (currentSkill.value < MAX_SKILL_POINTS) {
        updateSkill(skillIndex, currentSkill.value + 1);
      }
    }
  }, [player.skills, totalPoints, updateSkill]);

  const decrementSkill = useCallback((skillIndex: number) => {
    const currentSkill = player.skills[skillIndex];
    const minForThisSkill = getMinForSkill(currentSkill.name);
    if (currentSkill.value > minForThisSkill) {
      updateSkill(skillIndex, currentSkill.value - 1);
    }
  }, [player.skills, updateSkill, boostedSkill]);

  const resetSkills = useCallback(() => {
    const newSkills = player.skills.map(skill => ({
      ...skill,
      value: getMinForSkill(skill.name)
    }));
    setPlayer({ ...player, skills: newSkills });
  }, [player, boostedSkill]);

  const randomizeSkills = useCallback(() => {
    const newSkills: Skill[] = player.skills.map(skill => ({ ...skill, value: getMinForSkill(skill.name) }));
    let pointsToDistribute = MAX_TOTAL_POINTS - newSkills.reduce((sum, skill) => sum + skill.value, 0);

    while (pointsToDistribute > 0) {
      const randomSkillIndex = Math.floor(Math.random() * newSkills.length);
      if (newSkills[randomSkillIndex].value < MAX_SKILL_POINTS) {
        newSkills[randomSkillIndex].value++;
        pointsToDistribute--;
      }
    }
    setPlayer({ ...player, skills: newSkills });
  }, [player, boostedSkill, MAX_TOTAL_POINTS]);

  return {
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
  };
};