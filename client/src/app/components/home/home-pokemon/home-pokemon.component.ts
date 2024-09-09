import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-pokemon',
    standalone: true,
    imports: [],
    templateUrl: './home-pokemon.component.html',
    styleUrls: ['./home-pokemon.component.scss']
})
export class HomePokemonComponent implements OnInit, OnDestroy {
    private leftEyeElement: HTMLElement | null = null;
    private rightEyeElement: HTMLElement | null = null;
    private leftPupilElement: HTMLElement | null = null;
    private rightPupilElement: HTMLElement | null = null;
    private eyeWidth: number = 0;

    ngOnInit() {
        this.leftEyeElement = document.querySelector('.eye-1') as HTMLElement;
        this.rightEyeElement = document.querySelector('.eye-2') as HTMLElement;
        this.leftPupilElement = document.querySelector('.pupil-1') as HTMLElement;
        this.rightPupilElement = document.querySelector('.pupil-2') as HTMLElement;

        this.eyeWidth = this.leftEyeElement.clientWidth;

        document.addEventListener('mousemove', this.onMouseMove);
    }

    ngOnDestroy() {
        document.removeEventListener('mousemove', this.onMouseMove);
    }

    onMouseMove = (event: MouseEvent) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        if (this.leftEyeElement && this.rightEyeElement) {
            this.updateEyePosition(this.leftEyeElement, this.leftPupilElement, mouseX, mouseY);
            this.updateEyePosition(this.rightEyeElement, this.rightPupilElement, mouseX, mouseY);
        }
    }

    updateEyePosition(eyeElement: HTMLElement, pupilElement: HTMLElement | null, mouseX: number, mouseY: number) {
        const rekt = eyeElement.getBoundingClientRect();
        const eyeCenterX = rekt.left + rekt.width / 2;
        const eyeCenterY = rekt.top + rekt.height / 2;

        const distanceX = mouseX - eyeCenterX;
        const distanceY = mouseY - eyeCenterY;

        const percentageX = ((distanceX / (this.eyeWidth / 2)) * 50) + 50;
        const percentageY = ((distanceY / (this.eyeWidth / 2)) * 50) + 50;

        const clampedPercentageX = Math.max(0, Math.min(percentageX, 100));
        const clampedPercentageY = Math.max(0, Math.min(percentageY, 100));

        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxRadius = this.eyeWidth / 2 - (0.272727 * this.eyeWidth);

        if (pupilElement && distance < maxRadius) {
            pupilElement.style.cssText = `left: ${clampedPercentageX}%; top: ${clampedPercentageY}%;`
            eyeElement.style.transform = `rotate(0deg)`;
        } else if (pupilElement) {
            pupilElement.style.cssText = `left: 25%; top: 50%;`
            const angleDeg = this.angle(mouseX, mouseY, eyeCenterX, eyeCenterY);
            eyeElement.style.transform = `rotate(${angleDeg}deg)`;
        }
    }

    angle(cx: number, cy: number, ex: number, ey: number) {
        const dy = ey - cy;
        const dx = ex - cx;
        const rad = Math.atan2(dy, dx);
        const deg = rad * 180 / Math.PI;
        return deg;
    }
}