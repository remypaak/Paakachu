import {
    Component,
    HostListener,
    inject,
} from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RenderNotificationService } from '../../services/render-notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChangePasswordComponent } from '../burger-menu/sidebar/change-password/change-password.component';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-nav',
    animations: [
        trigger(
          'slideInOut', [
            transition(':enter', [
              style({ opacity: 0 }),
              animate('300ms ease-in', style({  opacity: 1 }))
            ]),
            transition(':leave', [
              style({  opacity: 1 }),
              animate('300ms ease-out', style({  opacity: 0 }))
            ])
          ]
        )
      ],
    standalone: true,
    imports: [NgClass, AsyncPipe, MatDialogModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss',
})
export class NavComponent {
    public renderService = inject(RenderNotificationService);
    accountService = inject(AccountService);
    dialog = inject(MatDialog);
    lastScrollTop = 0;
    isSettingsOpen = false;


    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this.dialog.openDialogs.length > 0){
            return
        }
        const navbar = document.querySelector('.nav-bar') as HTMLElement;
        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        if (currentScroll > this.lastScrollTop) {
            navbar.classList.add('hidden');
            this.isSettingsOpen = false;
        } else {
            navbar.classList.remove('hidden');
        }
        this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }

    openLoginModal() {
        this.dialog.open(LoginModalComponent, {
            autoFocus: false,
            ariaModal: true,
            ariaLabel: "Login modal",
            ariaDescribedBy: "modalDescription"
        })
    }

    openChangePasswordModal(event: Event){
        event.stopPropagation()
        this.dialog.open(ChangePasswordComponent, {
            autoFocus: false,
            ariaLabelledBy: 'dialogTitle',
            ariaDescribedBy: 'dialogDescription',
            ariaModal: true
        });
        
    }

    toggleSettings(){
        this.isSettingsOpen = !this.isSettingsOpen;
    }
    
    logOut(){
        this.accountService.logOut();
    }
}
