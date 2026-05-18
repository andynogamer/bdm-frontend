import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../shared/header/header';
import { User } from '../../services/user';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-employees',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    Header,
    HttpClientModule,
    MatSnackBarModule
  ],
  templateUrl: './register-employees.html',
  styleUrl: './register-employees.scss',
})
export class RegisterEmployees {
  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;
  selectedFileName: string = '';
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';
  hidePassword = true;

  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    alias: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    genero: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    correo_electronico: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8)]),
    foto: new FormControl(''),
    tipo_usuario: new FormControl('', [Validators.required])
  });

  constructor(
    public userService: User,
    private snackBar: MatSnackBar,

  ) { }

  get nameFC() { return this.registerForm.get('nombre'); }
  get lastNameFC() { return this.registerForm.get('apellido'); }
  get aliasFC() { return this.registerForm.get('alias'); }
  get emailFC() { return this.registerForm.get('corre_electronico'); }
  get passwordFC() { return this.registerForm.get('contrasena'); }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        this.selectedFilePreview = base64;

        this.registerForm.patchValue({
          foto: base64
        });
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.registerForm.patchValue({ foto: '' });
    this.registerForm.get('imageFormControl')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      //console.log(this.registerForm.value);
      this.userService.postEmployee(this.registerForm.value).subscribe({
        next: (data) => {
         
          
          this.snackBar.open(
            `${data}`,
            'Cerrar',
            { duration: 3000 }
          );
        },
        error: (e) => {
          this.snackBar.open(
            e.error.error,
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
    }
  }
}