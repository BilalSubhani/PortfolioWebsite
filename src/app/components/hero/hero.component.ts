import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, OnDestroy {
  typedText = '';
  fullText = 'Full Stack Developer';
  typingSpeed = 150;
  private typewriterInterval: any;

  constructor() {}

  ngOnInit(): void {
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }

  startTypewriter(): void {
    let charIndex = 0;
    this.typedText = '';

    this.typewriterInterval = setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.typedText += this.fullText.charAt(charIndex);
        charIndex++;
      } else {
        // Reset for a blinking cursor effect
        setTimeout(() => {
          this.resetTypewriter();
        }, 2000);
      }
    }, this.typingSpeed);
  }

  resetTypewriter(): void {
    clearInterval(this.typewriterInterval);
    this.startTypewriter();
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = 'assets/CV_Bilal Subhani.pdf';
    link.download = 'CV_Bilal Subhani.pdf';
    link.click();
  }

  scrollToContact(): void {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
