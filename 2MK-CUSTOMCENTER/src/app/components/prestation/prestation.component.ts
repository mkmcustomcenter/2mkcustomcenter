import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prestation.component.html',
  styleUrl: './prestation.component.scss'
})
export class PrestationComponent {
  constructor(private router: Router) {}

  goToCovering(): void {
    this.router.navigate(['/covering']);
  }

  goToSellerie(): void {
    this.router.navigate(['/sellerie']);
  }

}
