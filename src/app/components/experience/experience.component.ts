import { Component } from '@angular/core';
import { Experience } from '../../models/experience.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent {
  experiences: Experience[] = [
    {
      company: 'Tech Hype',
      location: 'Lahore, Pakistan',
      title: 'Junior Developer (MTO)',
      period: 'December 2024 - Present',
      responsibilities: [
        'Developing and maintaining frontend and backend applications using Angular and NestJS, working on both team-based and solo projects to deliver complete web solutions.',
        'Building ERP systems, e-commerce platforms, and other applications, handling authentication, dashboards, user roles, and business logic, while ensuring scalability and performance.',
        'Led a team for data entry on Pakistan Food Portal, helping the platform expand to 2,000+ restaurants in Lahore by ensuring smooth collaboration and timely task completion.',
      ],
    },
    {
      company: 'Tech Hype',
      location: 'Lahore, Pakistan',
      title: 'MERN Stack Developer Intern',
      period: 'September 2024 - November 2024',
      responsibilities: [
        "Contributed to Pakistan Food Portal's growth to 1,500+ active restaurants, helping surpass Foodpanda in Lahore.",
        'Identified and fixed bugs and performance issues, improving website speed and user experience.',
        'Improved website performance and usability by providing feedback and solutions to the development team.',
      ],
    },
    {
      company: 'PureLogics',
      location: 'Lahore, Pakistan',
      title: 'Intern Software Engineer (MERN)',
      period: 'September 2023 - December 2023',
      responsibilities: [
        'Completed MERN stack training and applied skills in real-world E-Commerce projects under supervision.',
        'Developed an E-Commerce platform with product and order management, helping admins track inventory and users manage orders easily.',
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
