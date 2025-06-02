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

      const form = document.createElement('form');
      form.method = 'POST';
      form.setAttribute('data-netlify', 'true');
      form.setAttribute('name', 'contact');

      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'form-name';
      hiddenField.value = 'contact';
      form.appendChild(hiddenField);

      Object.keys(this.contactForm.value).forEach((key) => {
        const input = document.createElement('input');
        input.type = key === 'message' ? 'textarea' : 'text';
        input.name = key;
        input.value = this.contactForm.value[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);

      Promise.resolve(form.submit())
        .then(() => {
          this.formSubmitted = true;
          this.formError = false;
          this.contactForm.reset();
        })
        .catch(() => {
          this.formError = true;
        })
        .finally(() => {
          this.isSubmitting = false;
          document.body.removeChild(form);
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
