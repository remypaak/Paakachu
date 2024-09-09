import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';
import { NgClass } from '@angular/common';
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./forgot-password/forgot-password.component";
import { FlipCardComponent } from "../../../shared/flip-card/flip-card.component";

@Component({
    selector: 'app-login-modal',
    standalone: true,
    imports: [ReactiveFormsModule, FormFieldComponent, NgClass, LoginComponent, ResetPasswordComponent, FlipCardComponent],
    templateUrl: './login-modal.component.html',
    styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent implements OnInit, AfterViewInit {
    formBuilder = inject(FormBuilder);
    forgotPasswordForm: FormGroup = new FormGroup({});
    isFlipped = false;
    renderer = inject(Renderer2);
    el = inject(ElementRef);
    
   @ViewChild(LoginComponent) loginComponent!: LoginComponent;
   @ViewChild(ResetPasswordComponent) resetPasswordComponent!: ResetPasswordComponent;
    

    ngOnInit(): void {
        this.initializeForgotPasswordForm()
    }

    ngAfterViewInit() {
        const flipCard = this.el.nativeElement.querySelector('.flip-card');
        this.renderer.addClass(flipCard, 'flip-initial');

        setTimeout(() => {
            this.renderer.removeClass(flipCard, 'flip-initial');
        }, 1000); 
    }

    initializeForgotPasswordForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['']
        })
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        if (this.isFlipped){
            this.setFocusOnEmailInput()
        }
        else {
            this.setFocusOnUsernameInput()
        }
    }

    setFocusOnUsernameInput(){
        const inputElement = this.loginComponent.usernameInput.inputElement;
        inputElement.nativeElement.focus()
    }

    setFocusOnEmailInput(){
        const inputElement = this.resetPasswordComponent.emailInput.inputElement;
        inputElement.nativeElement.focus()
    }

    @HostListener('document:keydown', ['$event'])
    handleTabKey(event: KeyboardEvent) {
      if (event.key !== 'Tab') {
        return;
      }
  
      const currentFirstElement = this.isFlipped ? this.resetPasswordComponent.firstElement : this.loginComponent.firstElement;
      const currentLastElement = this.isFlipped ? this.resetPasswordComponent.lastElement : this.loginComponent.lastElement;
      if (event.shiftKey) {
        if (document.activeElement === currentFirstElement) {
          event.preventDefault();
          currentLastElement.focus();
        }
      } else {
        if (document.activeElement === currentLastElement) {
          event.preventDefault();
          currentFirstElement.focus();
        }
      }
    }

    resetPassword() {

    }
}
