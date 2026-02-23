import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MatPseudoCheckboxModule, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-register-accidents',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatDatepickerModule, 
    MatButtonModule, 
    MatSelectModule,
    MatCheckboxModule,
    Header
  ],
  templateUrl: './register-accidents.html',
  styleUrl: './register-accidents.scss',
})
export class RegisterAccidents {
  selectedFiles: File[] = []; // Soporta múltiples archivos (fotos y videos)

  registerForm = new FormGroup({
    insuranceCompany: new FormControl('', [Validators.required]),
    policyNumber: new FormControl('', [Validators.required]), // Único por compañía 
    clientData: new FormControl('', [Validators.required]),
    unitData: new FormControl('', [Validators.required]),
    accidentDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    otherUnitsInvolved: new FormControl(false),
    description: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  onFilesSelected(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
      console.log('Archivos multimedia seleccionados:', this.selectedFiles);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.warn('Datos del siniestro listos para PHP:', this.registerForm.value);
      // Aquí enviarás el FormData a tu backend PHP
    }
  }
}
