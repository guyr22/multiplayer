export interface Skill {
    name: string;
    value: number;
  }
  
  export interface Role {
    name: string;
    boostedSkill: string; // the skill name that gets the min boost
  }
  
  export interface Player {
    id: string;
    name: string;
    skills: Skill[];
    role: string; // just the role name
  }