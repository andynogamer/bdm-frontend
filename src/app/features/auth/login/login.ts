import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../services/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  
  hidePassword = true; // Para toggle de visibilidad de contraseña

  loginForm = new FormGroup({
    correo_electronico: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  
  get emailFC() {
    return this.loginForm.get('correo_electronico');
  }
  
  get passwordFC() {
    return this.loginForm.get('contrasena');
  }

  constructor(public user: User) {}
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.user.postLogin(this.loginForm.value).subscribe({
        next: (data) =>{
          console.log(data);
        },
        error: (e) => {
          console.log(e);
        }
      })
    }
  }
}