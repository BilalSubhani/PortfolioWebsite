export interface Skill {
  name: string;
  icon: string; // Font Awesome or Material icon name
  category: 'frontend' | 'backend' | 'other';
  proficiency: number; // 1-5 scale
}
