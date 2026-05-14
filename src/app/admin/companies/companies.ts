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

@Component({
  selector: 'app-companies',
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
    HttpClientModule
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies {

  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';
  hidePassword = true;

  registerForm = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required]),
    lastNameFormControl: new FormControl('', [Validators.required]),
    aliasFormControl: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    genderFormControl: new FormControl('', [Validators.required]),
    birthDateFormControl: new FormControl('', [Validators.required]),
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(8)]),
    imageFormControl: new FormControl('', [Validators.required]),
    userTypeFormControl: new FormControl('', [Validators.required])
  });

  constructor(private userService: User) { }

  get nameFC() { return this.registerForm.get('nameFormControl'); }
  get lastNameFC() { return this.registerForm.get('lastNameFormControl'); }
  get aliasFC() { return this.registerForm.get('aliasFormControl'); }
  get emailFC() { return this.registerForm.get('emailFormControl'); }
  get passwordFC() { return this.registerForm.get('passwordFormControl'); }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      this.registerForm.patchValue({ imageFormControl: file as any });
      this.registerForm.get('imageFormControl')?.updateValueAndValidity();
      console.log('Archivo cargado:', file.name);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.registerForm.patchValue({ imageFormControl: '' });
    this.registerForm.get('imageFormControl')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      this.mensajeError = 'Por favor, complete todos los campos correctamente';
      return;
    }

    this.isLoading = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const birthDate = new Date(this.registerForm.value.birthDateFormControl!);
    const formattedDate = birthDate.toISOString().split('T')[0];

    let userType = 0;
    switch (this.registerForm.value.userTypeFormControl) {
      case '2': userType = 2; break;
      case '1': userType = 1; break;
      case '0': userType = 0; break;
      default: userType = 0;
    }

    let gender = '';
    switch (this.registerForm.value.genderFormControl) {
      case 'male': gender = 'Masculino'; break;
      case 'female': gender = 'Femenino'; break;
    }

    const userData: any = {
      name: this.registerForm.value.nameFormControl,
      lastName: this.registerForm.value.lastNameFormControl,
      alias: this.registerForm.value.aliasFormControl,
      email: this.registerForm.value.emailFormControl,
      password: this.registerForm.value.passwordFormControl,
      gender: gender,
      birthDate: formattedDate,
      userType: userType
    };

    console.log('Enviando datos:', userData);

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        userData.foto = reader.result;
        this.enviarAlBackend(userData);
      };
      reader.onerror = () => {
        this.isLoading = false;
        this.mensajeError = 'Error al leer la imagen';
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.enviarAlBackend(userData);
    }
  }

  enviarAlBackend(userData: any) {
    this.userService.postUser(userData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.isLoading = false;
        this.mensajeExito = '¡Usuario registrado exitosamente!';
        this.registerForm.reset();
        this.selectedFile = null;
        this.selectedFilePreview = null;
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
        this.mensajeError = error.error?.error || error.error?.message || 'Error al registrar el usuario';
        setTimeout(() => this.mensajeError = '', 5000);
      }
    });
  }
}
