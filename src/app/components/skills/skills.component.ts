import { Component, OnInit } from '@angular/core';
import { Skill } from '../../models/skill.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  skills: Skill[] = [
    // Frontend skills
    {
      name: 'HTML5',
      icon: 'fab fa-html5',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'CSS3',
      icon: 'fab fa-css3-alt',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'TypeScript',
      icon: 'fas fa-code',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'Angular',
      icon: 'fab fa-angular',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'JavaScript',
      icon: 'fab fa-js-square',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'React',
      icon: 'fab fa-react',
      category: 'frontend',
      proficiency: 3,
    },
    {
      name: 'Bootstrap',
      icon: 'fab fa-bootstrap',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'Tailwind CSS',
      icon: 'fas fa-paint-brush',
      category: 'frontend',
      proficiency: 3,
    },
    {
      name: 'SASS/SCSS',
      icon: 'fab fa-sass',
      category: 'frontend',
      proficiency: 4,
    },
    {
      name: 'Responsive Design',
      icon: 'fas fa-mobile-alt',
      category: 'frontend',
      proficiency: 4,
    },

    // Backend skills
    {
      name: 'NestJS',
      icon: 'fas fa-server',
      category: 'backend',
      proficiency: 4,
    },
    {
      name: 'Node.js',
      icon: 'fab fa-node-js',
      category: 'backend',
      proficiency: 4,
    },
    {
      name: 'Express.js',
      icon: 'fas fa-server',
      category: 'backend',
      proficiency: 4,
    },
    {
      name: 'MongoDB',
      icon: 'fas fa-database',
      category: 'backend',
      proficiency: 4,
    },
    {
      name: 'MySQL',
      icon: 'fas fa-database',
      category: 'backend',
      proficiency: 3,
    },
    { name: 'SQL', icon: 'fas fa-table', category: 'backend', proficiency: 3 },
    {
      name: 'REST API',
      icon: 'fas fa-exchange-alt',
      category: 'backend',
      proficiency: 5,
    },
    { name: 'JWT', icon: 'fas fa-key', category: 'backend', proficiency: 4 },
    {
      name: 'Cloudinary',
      icon: 'fas fa-cloud',
      category: 'backend',
      proficiency: 4,
    },
    {
      name: 'WebSockets',
      icon: 'fas fa-plug',
      category: 'backend',
      proficiency: 3,
    },
    {
      name: 'Firebase',
      icon: 'fas fa-fire',
      category: 'backend',
      proficiency: 3,
    },

    // Other skills
    { name: 'Git', icon: 'fab fa-git-alt', category: 'other', proficiency: 4 },
    {
      name: 'GitHub',
      icon: 'fab fa-github',
      category: 'other',
      proficiency: 4,
    },
    {
      name: 'Docker',
      icon: 'fab fa-docker',
      category: 'other',
      proficiency: 1,
    },
    { name: 'Linux', icon: 'fab fa-linux', category: 'other', proficiency: 3 },
    {
      name: 'Agile/Scrum',
      icon: 'fas fa-users',
      category: 'other',
      proficiency: 4,
    },
    {
      name: 'Data Analytics',
      icon: 'fas fa-chart-line',
      category: 'other',
      proficiency: 3,
    },
    {
      name: 'MS Excel',
      icon: 'fas fa-file-excel',
      category: 'other',
      proficiency: 4,
    },
    { name: 'Wix', icon: 'fas fa-globe', category: 'other', proficiency: 3 },
    {
      name: 'Python',
      icon: 'fab fa-python',
      category: 'other',
      proficiency: 3,
    },
    {
      name: 'C++',
      icon: 'fas fa-laptop-code',
      category: 'other',
      proficiency: 4,
    },
    { name: 'VS Code', icon: 'fas fa-code', category: 'other', proficiency: 4 },
    {
      name: 'Postman',
      icon: 'fas fa-paper-plane',
      category: 'other',
      proficiency: 4,
    },
    {
      name: 'API Dog',
      icon: 'fas fa-paper-plane',
      category: 'other',
      proficiency: 4,
    },
    { name: 'Testing', icon: 'fas fa-bug', category: 'other', proficiency: 3 },
  ];

  constructor() {}

  ngOnInit(): void {}

  getFrontendSkills(): Skill[] {
    return this.skills.filter((skill) => skill.category === 'frontend');
  }

  getBackendSkills(): Skill[] {
    return this.skills.filter((skill) => skill.category === 'backend');
  }

  getOtherSkills(): Skill[] {
    return this.skills.filter((skill) => skill.category === 'other');
  }

  getProficiencyArray(level: number): number[] {
    return Array(level).fill(0);
  }

  getEmptyProficiencyArray(level: number): number[] {
    return Array(5 - level).fill(0);
  }
}
