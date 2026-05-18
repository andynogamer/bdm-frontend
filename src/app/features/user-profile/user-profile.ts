import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Header } from '../../shared/header/header';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from '../../services/user';

@Component({
  selector: 'app-user-profile',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    Header,
    MatDatepickerModule,
    MatRadioModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {

  profileForm!: FormGroup;
  previewUrl: SafeUrl | string = 'default-user.png';
  selectedFile: File | null = null;
  hidePassword = true;

  constructor(
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    public userService: User
  ) {}

  ngOnInit() {

    // Inicializas vacío
    this.profileForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      alias: new FormControl('', [Validators.required]),
      genero: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
      correo_electronico: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.minLength(8)]),
      foto: new FormControl(null)
    });

    // Llamas al backend
    this.userService.getProfile().subscribe({
      next: (user) => {

        console.log(user);

        // Llenas el formulario
        this.profileForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          alias: user.alias,
          fecha_nacimiento: user.fecha_nacimiento,
          genero: user.genero,
          correo_electronico: user.correo_electronico
        });

        // Imagen de perfil
        if (user.foto) {
          this.previewUrl = user.foto;
        }
      },

      error: (err) => {
        console.error(err);
        console.log('HAY UN ERROR!!!')
        this.snackBar.open(
          'Error al cargar el perfil',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );

      this.profileForm.patchValue({
        foto: file
      });
    }
  }

  onUpdate() {

    if (this.profileForm.valid) {

      this.userService.updateUser(this.profileForm.value).subscribe({
        next: (data) =>{
          
          this.snackBar.open(
            'Información actualizada correctamente',
            'Cerrar',
            { duration: 3000 }
          );
        },
        error: (e) => {
          console.log(e);
          this.snackBar.open(
            e.error.error,
            'Cerrar',
            { duration: 3000 }
          );
        }
      })
      
    }
  }
}