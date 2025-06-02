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
        'Admin dashboard to manage text, images, and videos shown on the main landing page.',
      type: 'frontend',
      image: 'assets/images/frontend1.avif',
      technologies: ['Angular', 'TypeScript', 'Dashboard', 'Websocket Client'],
      github: 'https://github.com/BilalSubhani/BuilderAppFrontend',
    },
    {
      title: 'Haider Desk',
      description:
        'E-commerce site for purchasing copyrighted logos, banners, and other graphic assets, including an admin dashboard.',
      type: 'frontend',
      image: 'assets/images/frontend2.avif',
      technologies: ['Angular', 'TypeScript', 'Dashboard', 'E-Commerce'],
      github: 'https://github.com/BilalSubhani/haiderDesk',
    },
    {
      title: 'Portfolio Template',
      description:
        'Angular-based, ready-to-deploy portfolio template with a clean and efficient layout.',
      type: 'frontend',
      image: 'assets/images/frontend3.avif',
      technologies: ['Angular', 'TypeScript', 'Netlify'],
      github: 'https://github.com/BilalSubhani/PortfolioWebsite',
    },

    // Backend projects
    {
      title: 'Burq Backend',
      description:
        'Built with NestJS, MongoDB, JWT, Passport, Cloudinary, and WebSockets for real-time features.',
      type: 'backend',
      image: 'assets/images/backend1.avif',
      technologies: ['NestJS', 'MongoDB', 'JWT', 'Cloudinary', 'Websockets'],
      github: 'https://github.com/BilalSubhani/BuilderAppBackend',
    },
    {
      title: 'Haider Desk Backend',
      description:
        'NestJS backend using MongoDB, JWT, Passport, Cloudinary, WebSockets, and analytics tracking.',
      type: 'backend',
      image: 'assets/images/backend2.avif',
      technologies: ['NestJS', 'MongoDB', 'JWT', 'Cloudinary', 'Websockets'],
      github: 'https://github.com/BilalSubhani/haiderDeskBackend',
    },
    {
      title: 'Custom Backend',
      description:
        'Comprehensive backend with REST APIs, WebSockets, Nodemailer, Cloudinary, JWT, and chatbox support.',
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
