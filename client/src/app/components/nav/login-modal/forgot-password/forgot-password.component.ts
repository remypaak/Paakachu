import { Component, ElementRef, inject, output, Renderer2, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/form-field/form-field.component';
import { CustomFormValidators } from '../../../../utils/custom-form-validators';
import { DialogRef } from '@angular/cdk/dialog';
import { CloseButtonComponent } from "../../../../shared/close-button/close-button.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, CloseButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
    formBuilder = inject(FormBuilder);
    forgotPasswordForm: FormGroup = new FormGroup({});
    isFlipped = output<boolean>();
    renderer = inject(Renderer2);
    el = inject(ElementRef);
    dialogRef = inject(DialogRef);

    @ViewChild('emailInput') emailInput!: FormFieldComponent;
    @ViewChild('closeButton') closeButton!: CloseButtonComponent;
    @ViewChild('submitButton') submitButton!: ElementRef;

    firstElement!: HTMLElement;
    lastElement!: HTMLElement;

    ngOnInit(): void {
        this.initializeForgotPasswordForm()
    }

    ngAfterViewInit(): void {
        this.updateFocusElements()
    }

    initializeForgotPasswordForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, CustomFormValidators.customEmailValidator()]]
        });

        this.forgotPasswordForm.statusChanges.subscribe({
            next: () => {
                this.updateFocusElements();
            }
        })
    }

    updateFocusElements() {
        this.firstElement = this.closeButton.closeButton.nativeElement;

        if (!this.submitButton.nativeElement.disabled) {
            this.lastElement = this.submitButton.nativeElement;
        } else {
            this.lastElement = this.emailInput.inputElement.nativeElement;
        }
    }

    flip() {
        this.isFlipped.emit(!this.isFlipped);
    }

    resetPassword() {

    }

    closeDialog(){
        this.dialogRef.close();
    }
}
