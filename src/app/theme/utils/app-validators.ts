import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: FormControl): {[key: string]: any} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
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

export function noSpecialCharAllowed(control: FormControl) {
    var noSpecialCharRegexp =  /^[A-Za-z0-9 ]+$/;    
    if (control.value && !noSpecialCharRegexp.test(control.value)) {
        return {invalidSpecialChal: true};
    }
}

export function numberNotAllowed(control: FormControl){
    const noNumberRegex = /^[A-Za-z ]+$/;
    if(control.value && !noNumberRegex.test(control.value)){
        return {invalidNumber: true};
    }
}

export class WhiteSpaceValidator {
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        if(((control.value as string).trim().length === 0)){
            return {cannotContainSpace: true}
        }
  
        return null;
    }
}