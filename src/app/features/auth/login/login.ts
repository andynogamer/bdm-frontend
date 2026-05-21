import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router'; // <-- IMPORTAR ROUTER
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // <-- IMPORTAR SNACKBAR
import { User } from '../../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, 
    MatSelectModule, MatInputModule, MatButtonModule, MatCardModule,
    MatSnackBarModule // <-- AGREGAR AL IMPORTS
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  
  hidePassword = true;

  loginForm = new FormGroup({
    correo_electronico: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  
  get emailFC() { return this.loginForm.get('correo_electronico'); }
  get passwordFC() { return this.loginForm.get('contrasena'); }

  constructor(
    public user: User,
    private router: Router,       // <-- INYECTAR ROUTER
    private snackBar: MatSnackBar // <-- INYECTAR SNACKBAR
  ) {}
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.user.postLogin(this.loginForm.value).subscribe({
        next: (res: any) => {
          // 1. Guardamos una bandera en el navegador
          localStorage.setItem('isLogged', 'true');
          console.log(res);
          localStorage.setItem('userRole', res.tipo_usuario);

          // 2. Mostramos mensaje de bienvenida
          this.snackBar.open('¡Bienvenido al sistema!', 'Cerrar', { duration: 3000 });
          
          // 3. Redirigimos al home
          this.router.navigate(['/home']);
        },
        error: (e) => {
          // Mostramos el error del backend (ej. "Contraseña incorrecta")
          this.snackBar.open(e.error?.error || 'Error al iniciar sesión', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}