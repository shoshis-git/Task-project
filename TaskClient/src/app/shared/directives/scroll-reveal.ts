
import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  private el = inject(ElementRef);

  ngOnInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add('revealed');
          observer.unobserve(this.el.nativeElement); 
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.el.nativeElement);
    this.el.nativeElement.classList.add('reveal-hidden');
  }
}