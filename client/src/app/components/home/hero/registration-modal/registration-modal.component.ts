import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from "../../../../shared/form-field/form-field.component"
import { CustomFormValidators } from '../../../../utils/custom-form-validators';
import { FlipCardComponent } from "../../../../shared/flip-card/flip-card.component";
import { CloseButtonComponent } from "../../../../shared/close-button/close-button.component";
import { AccountService } from '../../../../services/account.service';
import { RegisterRequest } from '../../../../models/registerRequest';


@Component({
    selector: 'app-registration-modal',
    standalone: true,
    imports: [MatDialogModule, ReactiveFormsModule, FormFieldComponent, FlipCardComponent, CloseButtonComponent],
    templateUrl: './registration-modal.component.html',
    styleUrl: './registration-modal.component.scss'
})
export class RegistrationModalComponent implements OnInit {
    
    dialogRef = inject(MatDialogRef);
    formBuilder = inject(FormBuilder);
    registerForm: FormGroup = new FormGroup({});
    renderer = inject(Renderer2);
    el = inject(ElementRef);
    accountService = inject(AccountService);


    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: [
                '',
                [
                    Validators.required,
                    CustomFormValidators.customEmailValidator()
                ]
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    CustomFormValidators.requireNonAlphanumeric(),
                    CustomFormValidators.requireCapitalLetter(),
                    CustomFormValidators.requireNumber()
                ],
            ],
            confirmPassword: [
                '',
                [Validators.required, CustomFormValidators.matchValues('password')],
            ],
        });
        this.registerForm.controls['password'].valueChanges.subscribe({
            next: () =>
                this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const registerRequest: RegisterRequest = {
                userName: this.registerForm.controls['username'].value,
                email: this.registerForm.controls['email'].value,
                password: this.registerForm.controls['password'].value
            }
            this.accountService.register(registerRequest).subscribe({
                next: () => {
                    this.closeDialog();
                },
                error: () => {
                    console.log('Something went wrong during registration')
                }
            })
        }
    }

    closeDialog(): void {
        this.dialogRef.close()
    }
}
