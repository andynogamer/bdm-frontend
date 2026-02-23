import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { Header } from '../../shared/header/header';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register-employees',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatRadioModule, 
    MatDatepickerModule, 
    MatButtonModule, 
    MatSelectModule,
    Header,
    MatCardModule
  ],
  templateUrl: './register-employees.html',
  styleUrl: './register-employees.scss',
})
export class RegisterEmployees {

  selectedFile: File | null = null;

  typeUserSelected = "option1"

  registerForm = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    aliasFormControl: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(20)] ),
    genderFormControl: new FormControl('', [Validators.required]),
    birthDateFormControl: new FormControl('', [Validators.required]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(8)]),
    imageFormControl: new FormControl('', [Validators.required]),
    userTypeFormControl: new FormControl('', [Validators.required])
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

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    
    
    this.registerForm.patchValue({
      imageFormControl: file
    });

    
    this.registerForm.get('imageFormControl')?.updateValueAndValidity();
    
    console.log('Archivo cargado y control actualizado');
  }
}
  onSubmit(){
    console.warn(this.registerForm.value)
  }
 
}
