import { Component } from '@angular/core';
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
    try {
      const response = await fetch(`${environment.backendApiUrl}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.contact)
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Contact request failed');
      }

      this.sent = true;
      form.resetForm();
    } catch (e) {
      console.error('Contact send error:', e);
      this.error = e instanceof Error ? e.message : "Erreur lors de l'envoi. Merci de réessayer.";
    }
    this.sending = false;
  }
}
