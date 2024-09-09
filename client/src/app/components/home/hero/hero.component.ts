import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { RegistrationModalComponent } from './registration-modal/registration-modal.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  dialog = inject(MatDialog);

  openRegisterModal() {
    this.dialog.open(RegistrationModalComponent, {
        ariaModal: true,
        ariaLabelledBy: 'dialogTitle',
        ariaDescribedBy: 'dialogDescription'
    })
  }
}
