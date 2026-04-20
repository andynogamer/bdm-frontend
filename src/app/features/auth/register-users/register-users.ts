import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../services/user';


@Component({
  selector: 'app-register-users',
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatDatepickerModule,MatButtonModule, MatCardModule ],
  templateUrl: './register-users.html',
  styleUrl: './register-users.scss',
})
export class RegisterUsers {
  selectedFile: File | null = null;

  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    alias: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(20)] ),
    genero: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    correo_electronico: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8)]),
    foto: new FormControl(''),
    tipo_usuario: new FormControl(0)
  })

  get nameFC(){
    return this.registerForm.get('nombre')
  }

  get lastNameFC(){
    return this.registerForm.get('apellido')
  }

  get aliasFC(){
    return this.registerForm.get('alias')
  }

  get emailFC(){
    return this.registerForm.get('correo_electronico');
  }
  get passwordFC(){
    return this.registerForm.get('contrasena');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;

        this.registerForm.patchValue({
          foto: base64
        });
      };

      reader.readAsDataURL(file);
    }
  }
 
  
  constructor(public user: User) {}

  onSubmit(){
    console.log(this.registerForm.value);
    this.user.postUser(this.registerForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) =>{
        console.log(e);
      }
    });
  }

}
