import { AbstractControl, ValidatorFn } from "@angular/forms";


export class CustomFormValidators{
    static matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control.value === control.parent?.get(matchTo)?.value
                ? null
                : { isMatching: true };
        };
    }

    static noReusePassword(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control.value === control.parent?.get(matchTo)?.value
             ? {noReuse: true}
             : null;
        }
    }
    
    static requireNonAlphanumeric(): ValidatorFn {
        return (control: AbstractControl) => {
            const value: string = control.value;
            const nonAlphanumericRegex = /[^\w]/;
            if (nonAlphanumericRegex.test(value)) {
                return null;
            } else {
                return { requireNonAlphanumeric: true };
            }
        };
    }
    
    static requireNumber(): ValidatorFn {
        return (control: AbstractControl) => {
            const value: string = control.value;
            if (/\d/.test(value)) {
                return null;
            } else {
                return { requireNumber: true };
            }
        };
    }
    
    static requireCapitalLetter(): ValidatorFn {
        return (control: AbstractControl) => {
            const value: string = control.value;
            if (/[A-Z]/.test(value)) {
                return null;
            } else {
                return { requireCapitalLetter: true };
            }
        };
    }
    
    static customEmailValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            const email = control.value;
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
            if (email && !emailPattern.test(email)) {
                return { invalidEmail: true };
            }
            return null;
        };
    }
}

