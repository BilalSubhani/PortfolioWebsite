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
      title: 'E-Commerce Dashboard',
      description:
        'A responsive admin dashboard for e-commerce platforms with sales analytics, order management, and inventory tracking.',
      type: 'frontend',
      image: 'assets/images/project-dashboard.jpg',
      technologies: ['Angular', 'TypeScript', 'Chart.js', 'Bootstrap'],
      github: 'https://github.com/BilalSubhani/ecommerce-dashboard',
    },
    {
      title: 'Weather App',
      description:
        'A weather application that provides real-time weather forecasts using OpenWeatherMap API with location-based services.',
      type: 'frontend',
      image: 'assets/images/project-weather.jpg',
      technologies: ['React', 'CSS3', 'OpenWeatherMap API'],
      github: 'https://github.com/BilalSubhani/weather-app',
      demo: 'https://js-weather-app.netlify.app',
    },
    {
      title: 'Portfolio Template',
      description:
        'A customizable portfolio template for developers with animations and responsive design.',
      type: 'frontend',
      image: 'assets/images/project-portfolio.jpg',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
      github: 'https://github.com/BilalSubhani/portfolio-template',
      demo: 'https://js-portfolio-template.netlify.app',
    },

    // Backend projects
    {
      title: 'Restaurant API',
      description:
        'RESTful API for a restaurant management system with order processing, menu management, and user authentication.',
      type: 'backend',
      image: 'assets/images/project-restaurant.jpg',
      technologies: ['NestJS', 'MongoDB', 'JWT', 'Swagger'],
      github: 'https://github.com/BilalSubhani/restaurant-api',
    },
    {
      title: 'Chat Application',
      description:
        'Real-time chat application backend with room creation, private messaging, and user presence tracking.',
      type: 'backend',
      image: 'assets/images/project-chat.jpg',
      technologies: ['Node.js', 'Socket.io', 'Express', 'MongoDB'],
      github: 'https://github.com/BilalSubhani/chat-app-backend',
    },
    {
      title: 'Blog CMS API',
      description:
        'Content management system API for blogs with post management, categorization, and comment moderation.',
      type: 'backend',
      image: 'assets/images/project-blog.jpg',
      technologies: ['Express.js', 'PostgreSQL', 'Sequelize', 'AWS S3'],
      github: 'https://github.com/BilalSubhani/blog-cms-api',
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
