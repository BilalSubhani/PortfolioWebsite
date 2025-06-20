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
      title: 'Junior Developer (Angular/NestJS)',
      period: 'December 2024 - June 2025',
      responsibilities: [
        'Developed and maintained frontend and backend applications using Angular and NestJS, worked on both team-based and solo projects to deliver complete web solutions.',
        'Built ERP systems, e-commerce platforms, and other applications, handled authentication, dashboards, user roles, and business logic, while ensuring scalability and performance.',
        'Developed custom Shopify themes and snippets, and built admin apps using Shopify Polaris and Remix.',
        'Drove SEO and performance improvements with Lighthouse scores of 95+ (desktop) and 75+ (mobile)',
        'Led a team for data entry on Pakistan Food Portal, helping the platform expand to 2,000+ restaurants in Lahore by ensuring smooth collaboration and timely task completion.',
      ],
    },
    {
      company: 'Tech Hype',
      location: 'Lahore, Pakistan',
      title: 'MERN Stack Developer Intern',
      period: 'September 2024 - November 2024',
      responsibilities: [
        "Contributed to Pakistan Food Portal's growth to 1,000+ active restaurants, helping surpass Foodpanda in Lahore.",
        'Identified and fixed bugs and performance issues, improving website speed and user experience.',
        'Collaborated with the team to improve website functionality and user experience by 100%, through feedback, performance tuning, and usability enhancements.',
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
    {
      company: 'Pro IT City',
      location: 'Lahore, Pakistan',
      title: 'Media Manager',
      period: 'November 2021 - March 2022',
      responsibilities: [
        'Designed and executed social media strategies, increasing followers by 30% across Facebook, Instagram, and LinkedIn.',
        'Created 20+ original content pieces including posts, captions, and visuals to enhance online brand presence.',
        'Used Wix to create a client website, uploaded articles, and boosted website engagement through optimized content.',
        'Helped a client reach 10,000+ YouTube subscribers by managing content strategy and cross-platform promotion.',
      ],
    },
    {
      company: "The Alpha’s Digital Marketing",
      location: 'Lahore, Pakistan',
      title: 'Marketing Intern',
      period: 'October 2018 - April 2019',
      responsibilities: [
        'Assisted in 5+ digital marketing campaigns across Facebook and Instagram.',
        'Managed content for 10+ client pages, resulting in a 15% increase in average engagement.',
        'Completed all assigned tasks on time over 6 months, maintaining consistent performance.',
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void { }
}
