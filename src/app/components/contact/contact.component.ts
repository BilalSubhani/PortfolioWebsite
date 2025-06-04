import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  formSubmitted = false;
  formError = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append('form-name', 'contact');
      formData.append('name', this.contactForm.value.name);
      formData.append('email', this.contactForm.value.email);
      formData.append('message', this.contactForm.value.message);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      })
        .then(() => {
          this.formSubmitted = true;
          this.formError = false;
          this.contactForm.reset();
        })
        .catch((error) => {
          console.error('Error:', error);
          this.formError = true;
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  get nameControl() {
    return this.contactForm.get('name');
  }
  get emailControl() {
    return this.contactForm.get('email');
  }
  get messageControl() {
    return this.contactForm.get('message');
  }
}
