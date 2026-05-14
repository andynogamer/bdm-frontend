import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Header } from '../../shared/header/header';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { USUARIOS_DUMMY } from '../../core/models/dummyModels/usuarios.mocks';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, Header
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  profileForm!: FormGroup;
  previewUrl: SafeUrl | string = 'assets/default-user.png';
  selectedFile: File | null = null;
  hidePassword = true;

  constructor(private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const user = USUARIOS_DUMMY[0]; 
    
    this.profileForm = new FormGroup({
      name: new FormControl(user.name, [Validators.required]),
      lastName: new FormControl(user.lastName, [Validators.required]),
      alias: new FormControl(user.alias, [Validators.required]),
      email: new FormControl(user.correo, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(8)]),
      imageControl: new FormControl(null)
    });

    if (user.photo instanceof Blob && user.photo.size > 0) {
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(user.photo));
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.profileForm.patchValue({ imageControl: file });
    }
  }

  onUpdate() {
    if (this.profileForm.valid) {
      console.log('Actualizando datos...', this.profileForm.value);
      this.snackBar.open('Información actualizada correctamente', 'Cerrar', { duration: 3000 });
    }
  }
}