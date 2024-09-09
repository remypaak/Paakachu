import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from "../../../../shared/form-field/form-field.component";
import { CustomFormValidators } from '../../../../utils/custom-form-validators';
import { AutofocusDirective } from '../../../../directives/autofocus.directive';
import { MatDialogRef } from '@angular/material/dialog';
import { CloseButtonComponent } from "../../../../shared/close-button/close-button.component";
import { FlipCardComponent } from "../../../../shared/flip-card/flip-card.component";
import { AccountService } from '../../../../services/account.service';
import { ChangePasswordRequest } from '../../../../models/changePasswordRequest';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [FormFieldComponent, AutofocusDirective, CloseButtonComponent, FlipCardComponent, ReactiveFormsModule],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
    formBuilder = inject(FormBuilder);
    changePasswordForm: FormGroup = new FormGroup({});
    renderer = inject(Renderer2);
    el = inject(ElementRef);
    dialogRef = inject(MatDialogRef);
    accountService = inject(AccountService);

    ngOnInit(): void {
        this.initializeForm()
    }

    ngAfterViewInit() {
        const flipCard = this.el.nativeElement.querySelector('.flip-card');
        this.renderer.addClass(flipCard, 'flip-initial');

        setTimeout(() => {
            this.renderer.removeClass(flipCard, 'flip-initial');
        }, 1000);
      
    }

    initializeForm() {
        this.changePasswordForm = this.formBuilder.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [
                Validators.required,
                Validators.minLength(6),
                CustomFormValidators.requireNonAlphanumeric(),
                CustomFormValidators.requireCapitalLetter(),
                CustomFormValidators.requireNumber(),
                CustomFormValidators.noReusePassword('currentPassword')
            ]],
            confirmNewPassword: ['', [Validators.required, CustomFormValidators.matchValues('newPassword')]]
        });
        
        this.changePasswordForm.controls['currentPassword'].valueChanges.subscribe({
            next: () => 
                this.changePasswordForm.controls['newPassword'].updateValueAndValidity()
        });

        this.changePasswordForm.controls['newPassword'].valueChanges.subscribe({
            next: () =>
                this.changePasswordForm.controls['confirmNewPassword'].updateValueAndValidity(),
        });
    }

    changePassword(){
        const changePassword: ChangePasswordRequest = {
            currentPassword: this.changePasswordForm.controls['currentPassword'].value,
            newPassword: this.changePasswordForm.controls['newPassword'].value

        }
        this.accountService.changePassword(changePassword).subscribe({
            next: () => {
                this.closeDialog();
            },
            error: () => {
                console.log("Something went wrong while trying to change passwords")
            }
        });
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
