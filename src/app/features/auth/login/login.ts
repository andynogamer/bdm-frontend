import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule,MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
 
  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  
  get emailFC(){
    return this.loginForm.get('emailFormControl');
  }
  get passwordFC(){
    return this.loginForm.get('passwordFormControl');
  }
  onSubmit(){
    console.warn(this.loginForm.value)
  }

  

  
}
