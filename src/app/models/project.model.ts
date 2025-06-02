export interface Project {
  title: string;
  description: string;
  type: 'frontend' | 'backend';
  image: string; // Path to image
  technologies: string[];
  github: string;
  demo?: string; // Optional demo URL
}
