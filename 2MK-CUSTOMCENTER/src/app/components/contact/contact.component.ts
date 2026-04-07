import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { NgForm, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contact = { name: '', email: '', message: '' };
  sending = false;
  sent = false;
  error = '';

  async send(form: NgForm) {
    if (form.invalid) return;
    this.sending = true;
    this.error = '';
    console.log('Sending email...', this.contact);
    try {
      await emailjs.send(
        environment.emailJsServiceId,
        environment.emailJsTemplateId,
        {
          name: this.contact.name,
          email: this.contact.email,
          message: this.contact.message
        },
        environment.emailJsPublicKey
      );
      this.sent = true;
      form.resetForm();
    } catch (e) {
      console.error('EmailJS send error:', e);
      this.error = "Erreur lors de l'envoi. Merci de réessayer.";
    }
    this.sending = false;
  }
}
