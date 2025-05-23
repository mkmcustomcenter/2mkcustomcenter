import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [NgIf],
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.scss'
})
export class UnderConstructionComponent {
  phone = '0480159966';
  showTooltip = false;

  copyPhone() {
    navigator.clipboard.writeText(this.phone);
    this.showTooltip = true;
    setTimeout(() => this.showTooltip = false, 1500);
  }

  openContactForm() {
    // À personnaliser : ouvrir un modal, afficher un formulaire, etc.
    alert('Fonctionnalité à venir : formulaire de contact !');
  }
}
