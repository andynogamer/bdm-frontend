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
//import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Company } from '../../services/company';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-company',
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
    //HttpClientModule
  ],
  templateUrl: './register-company.html',
  styleUrl: './register-company.scss',
})
export class RegisterCompany {

  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;
  selectedFileName: string = '';
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';
  hidePassword = true;

  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    
    logo: new FormControl(''),
    
  });

  constructor(
    public companyService: Company,
    private snackBar: MatSnackBar
  ) { }

  get nameFC() { return this.registerForm.get('nombre'); }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        this.selectedFilePreview = base64;

        this.registerForm.patchValue({
          logo: base64
        });
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.registerForm.patchValue({ logo: '' });
    this.registerForm.get('logo')?.updateValueAndValidity();
  }

  onSubmit() {
    this.companyService.postCompany(this.registerForm.value).subscribe({
      next: (data) => {
        this.registerForm.reset();
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
    })
    
  }

}
