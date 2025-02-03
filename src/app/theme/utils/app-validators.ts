import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: FormControl): {[key: string]: any} | null {
    const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
    return null;
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password= group.controls[passwordKey];
        let passwordConfirmation= group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true})
        }
    }
}

export function noSpecialCharAllowed(control: FormControl): {[key: string]: any} | null { 
    const nameRegexp = /[!@#$%^&*(),.?":{}|<>]/;
    if (control.value && nameRegexp.test(control.value)) {
        return { invalidName: true };
    }
    return null;
}

export function numberNotAllowed(control: FormControl): {[key: string]: any} | null {      
    const nameRegexp = /[0-9]/;
    if (control.value && nameRegexp.test(control.value)) {
        return { invalidName: true };
    }
    return null;
}

export class WhiteSpaceValidator {
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        if(((control.value as string).trim().length === 0)){
            return {cannotContainSpace: true}
        }
  
        return null;
    }
}