import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-flip-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './flip-card.component.html',
  styleUrl: './flip-card.component.scss'
})
export class FlipCardComponent implements AfterViewInit{
    renderer = inject(Renderer2);
    el = inject(ElementRef);
    isFlipped = input<boolean>(false);

    ngAfterViewInit() {
        const flipCard = this.el.nativeElement.querySelector('.flip-card');
        this.renderer.addClass(flipCard, 'flip-initial');

        setTimeout(() => {
            this.renderer.removeClass(flipCard, 'flip-initial');
        }, 1000);
      
    }
}
