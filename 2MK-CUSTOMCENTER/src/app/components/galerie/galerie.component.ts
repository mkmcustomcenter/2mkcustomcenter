import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-galerie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galerie.component.html',
  styleUrl: './galerie.component.scss'
})
export class GalerieComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  autoplayInterval: any;
  isAutoplay = true;
  autoplayDuration = 5000; // 5 secondes

  images: CarouselImage[] = [
    {
      id: 1,
      src: 'assets/ban_2mk.png',
      alt: 'Banner 2MK Custom Center',
      title: 'Bienvenue chez 2MK'
    },
    {
      id: 2,
      src: 'assets/voiture.png',
      alt: 'Voiture personnalisée',
      title: 'Nos Réalisations'
    },
    {
      id: 3,
      src: 'assets/pp_optimized.png',
      alt: 'Portfolio professionnel',
      title: 'Portfolio'
    },
    {
      id: 4,
      src: 'assets/rendu.svg',
      alt: 'Rendu covering',
      title: 'Covering et Design'
    },
    {
      id: 5,
      src: 'assets/wip_2mk.png',
      alt: 'Work in progress',
      title: 'Nos Projets'
    }
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetAutoplay();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetAutoplay();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoplay();
  }

  startAutoplay(): void {
    if (!this.isAutoplay) return;
    this.autoplayInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, this.autoplayDuration);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  toggleAutoplay(): void {
    this.isAutoplay = !this.isAutoplay;
    if (this.isAutoplay) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }
}
