import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'app-mentions',
  standalone: true,
  imports: [],
  templateUrl: './mentions.component.html',
  styleUrl: './mentions.component.scss'
})
export class MentionsComponent implements AfterViewInit, OnDestroy {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private scrollContainer: HTMLElement | null = null;
  private sectionElement: HTMLElement | null = null;
  private mainContentElement: HTMLElement | null = null;
  private sectionObserver: IntersectionObserver | null = null;
  private isSectionActive = false;
  private readonly sectionIds = [1, 2, 3];

  openSections = new Set<number>();
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

  toggleSection(sectionNumber: number): void {
    if (this.openSections.has(sectionNumber)) {
      this.openSections.delete(sectionNumber);
      this.openSections = new Set(this.openSections);
      return;
    }

    this.openSections.add(sectionNumber);
    this.openSections = new Set(this.openSections);
  }

  isOpen(sectionNumber: number): boolean {
    return this.openSections.has(sectionNumber);
  }

  toggleAllSections(): void {
    if (this.areAllSectionsOpen()) {
      this.openSections = new Set<number>();
      return;
    }

    this.openSections = new Set(this.sectionIds);
  }

  areAllSectionsOpen(): boolean {
    return this.sectionIds.every((sectionId) => this.openSections.has(sectionId));
  }

  scrollToTop(): void {
    this.scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateBackToTopVisibility(): void {
    const scrollTop = this.scrollContainer?.scrollTop ?? 0;
    this.showBackToTop = this.isSectionActive && scrollTop > 220;
  }

}
