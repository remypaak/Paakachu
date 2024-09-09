import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [ReactiveFormsModule, AutofocusDirective],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
    label = input.required<string>();
    controlName = input.required<string>();
    type = input<string>("text");
    formGroup = input.required<FormGroup>();
    id = input.required<string>();
    required = input<boolean>(false)
    autofocus = input<boolean>(false);

    @ViewChild('input') inputElement!: ElementRef;

    get formControl() {
        return this.formGroup().controls[this.controlName()];
    }
}
