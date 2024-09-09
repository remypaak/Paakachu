import { DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-close-button',
  standalone: true,
  imports: [],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss'
})
export class CloseButtonComponent {
    dialogRef = inject(DialogRef);
    @ViewChild('closeButton') closeButton!: ElementRef;

    closeDialog(){
        this.dialogRef.close();
    }
}
