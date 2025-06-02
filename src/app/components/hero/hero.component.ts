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
  private resetTimeout: any;

  ngOnInit(): void {
    // this.startTypewriter();
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  private clearAllTimers(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
    }
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }
  }

  startTypewriter(): void {
    this.clearAllTimers();
    let charIndex = 0;
    this.typedText = '';

    this.typewriterInterval = setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.typedText += this.fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        this.resetTimeout = setTimeout(() => {
          this.startTypewriter();
        }, 2000);
      }
    }, this.typingSpeed);
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
