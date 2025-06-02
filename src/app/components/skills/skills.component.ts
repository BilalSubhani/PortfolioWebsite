import { Component } from '@angular/core';
import { Skill } from '../../models/skill.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  skills: Skill[] = [
    // Frontend skills
    { name: 'HTML5', icon: 'fa-html5', category: 'frontend', proficiency: 4 },
    { name: 'CSS3', icon: 'fa-css3-alt', category: 'frontend', proficiency: 4 },
    {
      name: 'TypeScript',
      icon: 'fa-code',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'Angular',
      icon: 'fa-angular',
      category: 'frontend',
      proficiency: 4,
    },
    { name: 'JavaScript', icon: 'fa-js', category: 'frontend', proficiency: 4 },
    { name: 'React', icon: 'fa-react', category: 'frontend', proficiency: 3 },

    // Backend skills
    { name: 'NestJS', icon: 'fa-server', category: 'backend', proficiency: 4 },
    {
      name: 'MongoDB',
      icon: 'fa-database',
      category: 'backend',
      proficiency: 4,
    },
    { name: 'SQL', icon: 'fa-database', category: 'backend', proficiency: 3 },
    {
      name: 'REST API',
      icon: 'fa-exchange-alt',
      category: 'backend',
      proficiency: 5,
    },
    { name: 'JWT', icon: 'fa-key', category: 'backend', proficiency: 4 },
    {
      name: 'Cloudinary',
      icon: 'fa-cloud',
      category: 'backend',
      proficiency: 4,
    },
    {
      name: 'WebSockets',
      icon: 'fa-plug',
      category: 'backend',
      proficiency: 3,
    },

    // Other skills
    {
      name: 'Data Analytics',
      icon: 'fa-chart-line',
      category: 'other',
      proficiency: 3,
    },
    {
      name: 'MS Excel',
      icon: 'fa-file-excel',
      category: 'other',
      proficiency: 4,
    },
    { name: 'Wix', icon: 'fa-w', category: 'other', proficiency: 3 },
    { name: 'Python', icon: 'fa-python', category: 'other', proficiency: 3 },
    { name: 'C++', icon: 'fa-laptop-code', category: 'other', proficiency: 4 },
  ];

  activeCategory: 'frontend' | 'backend' | 'other' = 'frontend';

  constructor() {}

  ngOnInit(): void {}

  setCategory(category: 'frontend' | 'backend' | 'other'): void {
    this.activeCategory = category;
  }

  getFilteredSkills(): Skill[] {
    return this.skills.filter(
      (skill) => skill.category === this.activeCategory
    );
  }

  getProficiencyArray(level: number): number[] {
    return Array(level).fill(0);
  }

  getEmptyProficiencyArray(level: number): number[] {
    return Array(5 - level).fill(0);
  }
}
