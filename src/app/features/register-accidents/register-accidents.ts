import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Header } from '../../shared/header/header';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// TODO: Importa tus servicios reales
// import { PolicyService } from '../../services/policy.service';
// import { AccidentService } from '../../services/accident.service';

@Component({
  selector: 'app-register-accidents',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatDatepickerModule, 
    MatButtonModule, 
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Header
  ],
  templateUrl: './register-accidents.html',
  styleUrl: './register-accidents.scss',
})
export class RegisterAccidents implements OnInit {
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';

  polizas: any[] = []; // Array temporal para cargar las pólizas del asegurado
  
  // Guardamos el File nativo (para la vista) y los datos procesados (para la BD)
  archivosProcesados: { archivo: File, base64: string, mime_type: string }[] = [];

  registerForm = new FormGroup({
    id_poliza: new FormControl('', [Validators.required]),
    nombre_chofer: new FormControl('', [Validators.required]),
    fecha_nacimiento_chofer: new FormControl('', [Validators.required]),
    fecha_hora_siniestro: new FormControl('', [Validators.required]),
    ubicacion: new FormControl('', [Validators.required]),
    unidad_involucrada: new FormControl(''), // Opcional (placas o número de terceros)
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  constructor(
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    // public policyService: PolicyService,
    // public accidentService: AccidentService
  ) {}

  ngOnInit(): void {
    this.cargarPolizas();
  }

  cargarPolizas() {
    // TODO: Llamada a tu API para traer las pólizas activas del usuario
    // Mock de ejemplo:
    this.polizas = [
      { id_poliza: 1, numero_poliza: 'POL-001', compania: 'Qualitas' },
      { id_poliza: 2, numero_poliza: 'POL-002', compania: 'GNP' }
    ];
  }

  onFilesSelected(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      this.procesarArchivos(files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files) as File[];
      this.procesarArchivos(files);
    }
  }

  procesarArchivos(files: File[]) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Completo = e.target.result;
        // Extraemos solo el Base64 limpio para la base de datos
        const base64Puro = base64Completo.split(',')[1];
        
        this.archivosProcesados.push({
          archivo: file,
          base64: base64Puro,
          mime_type: file.type // ej. image/png o video/mp4
        });
        
        this.cdr.detectChanges(); // Vital porque FileReader corre fuera de Angular
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.archivosProcesados.splice(index, 1);
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.mensajeError = '';
      this.mensajeExito = '';
      this.cdr.detectChanges();

      // 1. Armamos el array de multimedia como lo espera la base de datos
      const multimediaArray = this.archivosProcesados.map(item => ({
        evidencia: item.base64,
        etiqueta: item.archivo.name,
        mime_type: item.mime_type
      }));

      // 2. Preparamos el payload final
      const payload = {
        siniestro: this.registerForm.value,
        multimedia: multimediaArray
      };

      console.log('Payload a enviar:', payload);

      // TODO: Descomentar cuando conectes a tu API
      /*
      this.accidentService.postAccident(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.mensajeExito = 'Siniestro registrado exitosamente.';
          this.registerForm.reset();
          this.archivosProcesados = [];
          this.cdr.detectChanges();
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          this.isLoading = false;
          this.mensajeError = err.error?.error || 'Error al registrar el siniestro';
          this.cdr.detectChanges();
          this.snackBar.open(this.mensajeError, 'Cerrar', { duration: 3000 });
        }
      });
      */

      // Simulación temporal:
      setTimeout(() => {
        this.isLoading = false;
        this.mensajeExito = 'Siniestro simulado con éxito.';
        this.registerForm.reset();
        this.archivosProcesados = [];
        this.cdr.detectChanges();
      }, 1500);
    }
  }
}