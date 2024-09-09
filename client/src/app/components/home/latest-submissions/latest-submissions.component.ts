import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-latest-submissions',
    standalone: true,
    imports: [],
    templateUrl: './latest-submissions.component.html',
    styleUrl: './latest-submissions.component.scss'
})
export class LatestSubmissionsComponent implements OnInit, AfterViewInit {
    @ViewChild('imageTrack', { static: true }) trackRef!: ElementRef<HTMLElement>;
    private track!: HTMLElement;
    private elementRef = inject(ElementRef);
    maxHorizontalScroll: number = 2;
    trackTranslationFactor: number = 1;

    ngOnInit(): void {
        this.setBreakpointDependentProperties()
    }

    ngAfterViewInit(): void {
        this.track = this.trackRef.nativeElement;
        this.setUpTouchEventListeners();
    }

    // Touch event listeners are made "passive" by default for performance optimization. Passive event listeners don't wait
    // for preventDefault() calls. By making them explicitly non-passive we can use the preventDefault again.
    // @HostListener in Angular can't make them non-passive as of Angular 18
    setUpTouchEventListeners() {
        this.track.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.track.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.track.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
    }

    setBreakpointDependentProperties() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth > 750 && viewportWidth <= 1000) {
            this.maxHorizontalScroll = 1;
            this.trackTranslationFactor = 2;
        }
        else if (viewportWidth > 600 && viewportWidth <= 750) {
            this.maxHorizontalScroll = 0.75;
            this.trackTranslationFactor = 3;
        }
        else if (viewportWidth > 450 && viewportWidth <= 600) {
            this.maxHorizontalScroll = 0.5;
            this.trackTranslationFactor = 3.5;
        }
        else if (viewportWidth <= 450) {
            this.maxHorizontalScroll = 0.4;
            this.trackTranslationFactor = 4.5;
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.handleOnDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        this.handleOnUp(event);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.handleOnMove(event)
    }

    onTouchStart(event: TouchEvent) {
        if (event) {
            event.preventDefault();
        }
        const touch = event.touches[0];
        this.handleOnDown(touch);
    }

    onTouchMove(event: TouchEvent) {
        if (event) {
            event.preventDefault();
        }
        const touch = event.touches[0];
        this.handleOnMove(touch);
    }

    onTouchEnd(event: TouchEvent) {
        if (event) {
            event.preventDefault();
        }
        const touch = event.changedTouches[0];
        this.handleOnUp(touch);
    }

    handleOnMove(event: MouseEvent | Touch) {
        if (this.elementRef.nativeElement.contains(event.target)) {
            const mousePrev = parseFloat(this.track.dataset['mouseDownAt']!)
            if (mousePrev === 0) {
                return;
            }
            const mouseDelta = mousePrev - event.clientX,
                maxDelta = window.innerWidth / this.maxHorizontalScroll;

            const percentage = (mouseDelta / maxDelta) * -100,
                nextPercentageBase = parseFloat(this.track.dataset['prevPercentage']!) + percentage,
                nextPercentage = Math.max(Math.min(nextPercentageBase, 0), -100);

            this.track.dataset['percentage'] = nextPercentage.toString();
            this.track.animate({
                transform: `translate(${nextPercentage * this.trackTranslationFactor}%, 0)`
            }, { duration: 1200, fill: "forwards" });

            for (const image of Array.from(this.track.getElementsByClassName("image"))) {
                image.animate({
                    objectPosition: `${100 + nextPercentage}% center`
                }, { duration: 1200, fill: "forwards" });
            }
        }

    }

    handleOnDown(event: MouseEvent | Touch) {
        if (this.elementRef.nativeElement.contains(event.target)) {
            this.track.dataset['mouseDownAt'] = event.clientX.toString();

        }

    }

    handleOnUp(event: MouseEvent | Touch) {
        if (this.elementRef.nativeElement.contains(event.target)) {
            this.track.dataset['mouseDownAt'] = "0";
            this.track.dataset['prevPercentage'] = this.track.dataset['percentage']
        }
    }

}
