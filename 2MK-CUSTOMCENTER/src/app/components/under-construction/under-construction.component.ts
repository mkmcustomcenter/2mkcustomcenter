import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [NgIf, ContactComponent],
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.scss'
})
export class UnderConstructionComponent {
  phone = '0480159966';
  showTooltip = false;
  isModalOpen = false;

  copyPhone() {
    navigator.clipboard.writeText(this.phone);
    this.showTooltip = true;
    setTimeout(() => this.showTooltip = false, 1500);
  }
  openContactForm() {
    this.isModalOpen = true;
  }

  closeContactForm() {
    this.isModalOpen = false;
  }
  
}
