import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-register-users',
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatDatepickerModule,MatButtonModule ],
  templateUrl: './register-users.html',
  styleUrl: './register-users.scss',
})
export class RegisterUsers {
  registerForm = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    aliasFormControl: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(20)] ),
    genderFormControl: new FormControl('', [Validators.required]),
    birthDateFormControl: new FormControl('', [Validators.required]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  get nameFC(){
    return this.registerForm.get('nameFormControl')
  }

  get lastNameFC(){
    return this.registerForm.get('lastNameFormControl')
  }

  get aliasFC(){
    return this.registerForm.get('aliasFormControl')
  }

  get emailFC(){
    return this.registerForm.get('emailFormControl');
  }
  get passwordFC(){
    return this.registerForm.get('passwordFormControl');
  }


  onSubmit(){
    console.warn(this.registerForm.value)
  }

}
