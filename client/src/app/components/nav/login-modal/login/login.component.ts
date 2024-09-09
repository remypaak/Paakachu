import { Component, inject, output, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from "../../../../shared/form-field/form-field.component";
import { DialogRef } from '@angular/cdk/dialog';
import { CloseButtonComponent } from "../../../../shared/close-button/close-button.component";
import { AccountService } from '../../../../services/account.service';
import { LoginRequest } from '../../../../models/loginRequest';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormFieldComponent, ReactiveFormsModule, CloseButtonComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
    formBuilder = inject(FormBuilder);
    loginForm: FormGroup = new FormGroup({});
    isFlipped = output<boolean>();
    dialogRef = inject(DialogRef);
    accountService = inject(AccountService);

    @ViewChild('usernameInput') usernameInput!: FormFieldComponent;
    @ViewChild('closeButton') closeButton!: CloseButtonComponent;
    @ViewChild('forgotPasswordLink') forgotPasswordLink!: ElementRef;

    firstElement!: HTMLElement;
    lastElement!: HTMLElement;

    ngOnInit(): void {
        this.initializeLoginForm();
    }

    ngAfterViewInit(): void {
        this.firstElement = this.closeButton.closeButton.nativeElement;
        this.lastElement = this.forgotPasswordLink.nativeElement;
    }

    initializeLoginForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    flip(): void {
        this.isFlipped.emit(!this.isFlipped);
    }

    logIn(): void {
        const loginRequest: LoginRequest = {
            userName: this.loginForm.controls['username'].value,
            password: this.loginForm.controls['password'].value
        }
        this.accountService.login(loginRequest).subscribe({
            next: () => {
                this.closeDialog();
            },
            error: () => {
                console.log('Error while loggin in');
            }
        });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
