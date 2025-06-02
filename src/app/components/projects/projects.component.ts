import { Component } from '@angular/core';
import { Project } from '../../models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: Project[] = [
    // Frontend projects
    {
      title: 'Builder App',
      description:
        'A responsive admin dashboard for e-commerce platforms with sales analytics, order management, and inventory tracking.',
      type: 'frontend',
      image: 'assets/images/frontend1.avif',
      technologies: ['Angular', 'TypeScript', 'Dashboard', 'Websocket Client'],
      github: 'https://github.com/BilalSubhani/BuilderAppFrontend',
    },
    {
      title: 'Haider Desk',
      description:
        'A weather application that provides real-time weather forecasts using OpenWeatherMap API with location-based services.',
      type: 'frontend',
      image: 'assets/images/frontend2.avif',
      technologies: ['Angular', 'TypeScript', 'Dashboard', 'E-Commerce'],
      github: 'https://github.com/BilalSubhani/haiderDesk'
    },
    {
      title: 'Portfolio Template',
      description:
        'A customizable portfolio template for developers with animations and responsive design.',
      type: 'frontend',
      image: 'assets/images/frontend3.avif',
      technologies: ['Angular', 'TypeScript', 'Netlify'],
      github: 'https://github.com/BilalSubhani/PortfolioWebsite'
    },

    // Backend projects
    {
      title: 'Burq Backend',
      description:
        'RESTful API for a restaurant management system with order processing, menu management, and user authentication.',
      type: 'backend',
      image: 'assets/images/backend1.avif',
      technologies: ['NestJS', 'MongoDB', 'JWT', 'Cloudinary', 'Websockets'],
      github: 'https://github.com/BilalSubhani/BuilderAppBackend',
    },
    {
      title: 'Haider Desk Backend',
      description:
        'Real-time chat application backend with room creation, private messaging, and user presence tracking.',
      type: 'backend',
      image: 'assets/images/backend2.avif',
      technologies: ['NestJS', 'MongoDB', 'JWT', 'Cloudinary', 'Websockets'],
      github: 'https://github.com/BilalSubhani/haiderDeskBackend',
    },
    {
      title: 'Custom Backend',
      description:
        'Content management system API for blogs with post management, categorization, and comment moderation.',
      type: 'backend',
      image: 'assets/images/backend3.avif',
      technologies: ['NestJS', 'MongoDB', 'JWT', 'Chatbox', 'Websockets'],
      github: 'https://github.com/BilalSubhani/Backend-NestJs',
    },
  ];

  activeType: 'frontend' | 'backend' = 'frontend';

  constructor() {}

  ngOnInit(): void {}

  setType(type: 'frontend' | 'backend'): void {
    this.activeType = type;
  }

  getFilteredProjects(): Project[] {
    return this.projects.filter((project) => project.type === this.activeType);
  }
}
