import { Component, ElementRef, inject, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
    selector: 'app-sidebar',
    animations: [
        trigger(
            'slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-25%)', opacity: 0 }),
                animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0)', opacity: 1 }),
                animate('300ms ease-out', style({ transform: 'translateY(-25%)', opacity: 0 }))
            ])
        ]
        )
    ],
    standalone: true,
    imports: [AsyncPipe, NgClass],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SideBarComponent implements OnInit, OnDestroy {
    settingsOpen = false;
    dialog = inject(MatDialog);
    closeSidebar = output();
    @ViewChild('overlay') overlay!: ElementRef;
    @ViewChild('settings') settings!: ElementRef;
    @ViewChild('changeSettings') changeSettings!: ElementRef;
    burgerMenuElement!: HTMLElement;



    ngOnInit(): void {
        this.burgerMenuElement = document.querySelector('.burger-menu') as HTMLElement;
        document.addEventListener('keydown', this.handleKeyDown);
    }

    ngOnDestroy(): void {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event: KeyboardEvent): void => {
        if (!this.overlay.nativeElement.classList.contains('open')) {
            return;
        }
        if (event.key === 'Tab') {
            this.handleTab(event)
        }
        if (event.key === 'Escape') {
            this.handleEscape()
        }
    }

    handleTab(event: KeyboardEvent) {
        let lastElement;
        if (this.settingsOpen) {
            lastElement = this.changeSettings;
        } else {
            lastElement = this.settings;
        }
        if (event.shiftKey) {
            if (document.activeElement === this.burgerMenuElement) {
                lastElement.nativeElement.focus();
                event.preventDefault()
            }
        } else {
            if (document.activeElement === lastElement.nativeElement) {
                this.burgerMenuElement.focus();
                event.preventDefault();
            }
        }
    }

    handleEscape() {
        this.settingsOpen = false;
        this.closeSidebar.emit()
        this.burgerMenuElement.focus();
    }

    toggleSettings(): void {
        this.settingsOpen = !this.settingsOpen;
    }

    openChangePasswordDialog(event: MouseEvent) {
        const dialogRef = this.dialog.open(ChangePasswordComponent, {
            autoFocus: false,
            ariaLabelledBy: 'dialogTitle',
            ariaDescribedBy: 'dialogDescription',
            ariaModal: true
        });
        this.settingsOpen = false;
        this.closeSidebar.emit()
        dialogRef.afterClosed().subscribe({
            next: () => {
                this.burgerMenuElement.focus();
            }
        })
        event.stopPropagation();
    }
}
