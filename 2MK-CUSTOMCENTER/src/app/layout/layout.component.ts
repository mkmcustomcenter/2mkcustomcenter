import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, Signal } from '@angular/core';

import { IntroComponent } from '../components/intro/intro.component';
// import { PresentationComponent } from '../components/presentation/presentation.component';
import { PrestationComponent } from '../components/prestation/prestation.component';
import { GalerieComponent } from '../components/galerie/galerie.component';
// import { ReservationComponent } from '../components/reservation/reservation.component';
import { EvenementsComponent } from '../components/evenements/evenements.component';
import { ContactComponent } from '../components/contact/contact.component';
import { MentionsComponent } from '../components/mentions/mentions.component';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    IntroComponent,
    // PresentationComponent,
    PrestationComponent,
    // GalerieComponent,
    // ReservationComponent,
    // EvenementsComponent,
    ContactComponent,
    MentionsComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;
  isHeaderVisible!: Signal<boolean>;

  constructor(private headerService: HeaderService) {
    this.isHeaderVisible = this.headerService.isHeaderVisible;
  }

  scrollToSection(sectionId: string): void {
    const section: HTMLElement | null = document.getElementById(sectionId);
    if (section && this.mainContent) {
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent): void {
    if (event.deltaX !== 0) {
      event.preventDefault();
    }
  }
}