import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

interface DashboardGalleryImage {
  id: number;
  titre: string;
  description: string;
  imageUrl: string;
  categorie: string;
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
  autoplayInterval: ReturnType<typeof setInterval> | null = null;
  isAutoplay = true;
  autoplayDuration = 5000; // 5 secondes

  images: CarouselImage[] = [
    {
      id: 1,
      src: 'assets/ban_2mk.png',
      alt: 'Banner 2MK Custom Center',
      title: 'Bienvenue chez 2MK'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardImages();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  nextSlide(): void {
    if (this.images.length === 0) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetAutoplay();
  }

  prevSlide(): void {
    if (this.images.length === 0) {
      return;
    }

    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetAutoplay();
  }

  goToSlide(index: number): void {
    if (this.images.length === 0) {
      return;
    }

    this.currentIndex = index;
    this.resetAutoplay();
  }

  startAutoplay(): void {
    if (!this.isAutoplay || this.images.length <= 1) {
      return;
    }

    this.autoplayInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, this.autoplayDuration);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
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

  private loadDashboardImages(): void {
    const rawData = localStorage.getItem('galerieImages');
    if (!rawData) {
      return;
    }

    try {
      const parsedData = JSON.parse(rawData) as DashboardGalleryImage[];
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        return;
      }

      const dynamicImages: CarouselImage[] = parsedData
        .filter((image) => !!image?.imageUrl)
        .map((image) => ({
          id: image.id,
          src: this.normalizeImageUrl(image.imageUrl),
          alt: image.titre || 'Image galerie 2MK',
          title: image.titre || 'Réalisation 2MK'
        }));

      if (dynamicImages.length > 0) {
        this.images = [...dynamicImages, ...this.images];
      }
    } catch (error) {
      console.error('Erreur de lecture des images dashboard:', error);
    }
  }

  private normalizeImageUrl(url: string): string {
    if (!url) {
      return '';
    }

    if (url.startsWith('data:image/')) {
      return url;
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/assets/')) {
      return url;
    }

    if (url.startsWith('assets/')) {
      return `/${url}`;
    }

    return url;
  }
}
