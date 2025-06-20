import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

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
  private isDestroyed = false;

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    // Run outside Angular's zone to prevent excessive change detection
    this.ngZone.runOutsideAngular(() => {
      this.startTypewriter();
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
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

  private startTypewriter(): void {
    // Prevent execution if component is destroyed
    if (this.isDestroyed) return;

    this.clearAllTimers();
    let charIndex = 0;

    // Reset text in Angular zone
    this.ngZone.run(() => {
      this.typedText = '';
    });

    this.typewriterInterval = setInterval(() => {
      // Check if component is still alive
      if (this.isDestroyed) {
        this.clearAllTimers();
        return;
      }

      if (charIndex < this.fullText.length) {
        // Update text in Angular zone
        this.ngZone.run(() => {
          this.typedText += this.fullText.charAt(charIndex);
        });
        charIndex++;
      } else {
        // Typing completed
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;

        // Set reset timeout
        this.resetTimeout = setTimeout(() => {
          if (!this.isDestroyed) {
            this.startTypewriter();
          }
        }, 2000);
      }
    }, this.typingSpeed);
  }

  downloadCV(): void {
    window.open(
      'https://drive.google.com/file/d/1rwbeCIn2B14p3TXmadm03BzzEMrhSzkL/view?usp=sharing',
      '_blank'
    );
  }

  scrollToContact(): void {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/*
export class HeroComponentSimple implements OnInit, OnDestroy {
  typedText = '';
  fullText = 'Full Stack Developer';
  typingSpeed = 150;
  private typewriterInterval: any;

  ngOnInit(): void {
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }

  private startTypewriter(): void {
    let charIndex = 0;
    this.typedText = '';

    this.typewriterInterval = setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.typedText += this.fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        // Don't restart - just finish
      }
    }, this.typingSpeed);
  }

  // ... rest of methods
}
*/
