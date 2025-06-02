export interface Project {
  title: string;
  description: string;
  type: 'frontend' | 'backend';
  image: string;
  technologies: string[];
  github: string;
  demo?: string;
}
