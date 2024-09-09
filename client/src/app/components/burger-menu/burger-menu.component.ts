import { AfterViewInit, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { SideBarComponent } from './sidebar/sidebar.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-burger-menu',
    standalone: true,
    imports: [SideBarComponent],
    templateUrl: './burger-menu.component.html',
    styleUrl: './burger-menu.component.scss'
})
export class BurgerMenuComponent implements AfterViewInit {
    @ViewChild('burgerMenu') burgerMenuRef!: ElementRef<HTMLElement>;
    private overlayElement: Element | null = null;
    private bodyElement: Element | null = null;
    private lastScrollTop = 0;
    private elementRef = inject(ElementRef);
    private dialog = inject(MatDialog);

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this.dialog.openDialogs.length > 0){
            return;
        }
        const burgerMenu = this.burgerMenuRef.nativeElement;
        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        burgerMenu.classList.toggle('hidden', currentScroll > this.lastScrollTop);
        this.lastScrollTop = Math.max(currentScroll, 0);
    }

    @HostListener('document:click', ['$event'])
    onClickOutsideSidebar(event: MouseEvent) {
        const overlayRef = document.querySelector('.overlay.open')
        const sidebar = this.elementRef.nativeElement.querySelector('.sidebar-container') as HTMLElement;
        const targetElement = event.target as HTMLElement;

        if (overlayRef && !sidebar.contains(targetElement) && !targetElement.closest('.burger-menu')) {
            this.closeSidebar();
        }
    }

    ngAfterViewInit(): void {
        this.overlayElement = document.querySelector('.overlay');
        this.bodyElement = document.querySelector('body');
    }

    toggleSidebarMenu() {
        if (this.overlayElement?.classList.contains('open')) {
            this.closeSidebar()

        }
        else {
            this.openSidebar();
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.toggleSidebarMenu()
        }
    }

    private openSidebar() {
        this.overlayElement?.classList.add('open');
        this.bodyElement?.classList.add('modal-open')
        this.burgerMenuRef.nativeElement.classList.add('open');
        this.burgerMenuRef.nativeElement.setAttribute('aria-expanded', 'true');
    }

    closeSidebar() {
        this.bodyElement?.classList.remove('modal-open')
        this.overlayElement?.classList.remove('open');
        this.overlayElement?.classList.add('close')
        this.burgerMenuRef?.nativeElement.classList.remove('open')
        setTimeout(() => {
            this.overlayElement?.classList.remove('close')
        }, 500);
        this.burgerMenuRef.nativeElement.setAttribute('aria-expanded', 'false');
    }
}

