import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-accidents',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatDatepickerModule, 
    MatButtonModule, 
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    Header
  ],
  templateUrl: './register-accidents.html',
  styleUrl: './register-accidents.scss',
})
export class RegisterAccidents {
  selectedFiles: File[] = [];

  registerForm = new FormGroup({
    insuranceCompany: new FormControl('', [Validators.required]),
    policyNumber: new FormControl('', [Validators.required]),
    clientData: new FormControl('', [Validators.required]),
    unitData: new FormControl('', [Validators.required]),
    accidentDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    otherUnitsInvolved: new FormControl(false),
    description: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  onFilesSelected(event: any) {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as File[];
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log('Archivos multimedia seleccionados:', this.selectedFiles);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const newFiles = Array.from(event.dataTransfer.files) as File[];
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log('Archivos arrastrados:', this.selectedFiles);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.warn('Datos del siniestro:', this.registerForm.value);
      console.warn('Archivos multimedia:', this.selectedFiles);
      // Aquí enviarás el FormData a tu backend PHP
    }
  }
}