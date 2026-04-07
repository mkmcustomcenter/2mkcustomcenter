import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prestation.component.html',
  styleUrl: './prestation.component.scss'
})
export class PrestationComponent implements AfterViewInit, OnDestroy {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private scrollContainer: HTMLElement | null = null;
  private sectionElement: HTMLElement | null = null;
  private mainContentElement: HTMLElement | null = null;
  private sectionObserver: IntersectionObserver | null = null;
  private isSectionActive = false;

  showBackToTop = false;

  private readonly onScroll = (): void => {
    this.updateBackToTopVisibility();
  };

  ngAfterViewInit(): void {
    this.sectionElement = this.hostElement.nativeElement.closest('section');
    this.scrollContainer = this.sectionElement;
    this.mainContentElement = this.sectionElement?.parentElement as HTMLElement | null;

    this.scrollContainer?.addEventListener('scroll', this.onScroll, { passive: true });

    if (this.sectionElement && this.mainContentElement) {
      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          this.isSectionActive = entry?.isIntersecting === true && entry.intersectionRatio >= 0.6;
          this.updateBackToTopVisibility();
        },
        {
          root: this.mainContentElement,
          threshold: [0.6]
        }
      );

      this.sectionObserver.observe(this.sectionElement);
    }

    this.onScroll();
  }

  ngOnDestroy(): void {
    this.scrollContainer?.removeEventListener('scroll', this.onScroll);
    this.sectionObserver?.disconnect();
  }

  goToCovering(): void {
    this.scrollToSection('detail-covering');
  }

  goToSellerie(): void {
    this.scrollToSection('detail-sellerie-auto-bateau-medical');
  }

  private scrollToSection(sectionId: string): void {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  scrollToTop(): void {
    this.scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateBackToTopVisibility(): void {
    const scrollTop = this.scrollContainer?.scrollTop ?? 0;
    this.showBackToTop = this.isSectionActive && scrollTop > 220;
  }

}
