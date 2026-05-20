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
import { PolicyService } from '../../services/policy-service';
import { AccidentService } from '../../services/accident-service';

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
    public policyService: PolicyService,
    public accidentService: AccidentService
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
        
        // ¡CAMBIO CLAVE! 
        // Como tu PHP hace: explode(',', $base64String) y valida count($partes) === 2
        // debemos guardar y enviar el base64Completo (con todo y el "data:image/png;base64,")
        this.archivosProcesados.push({
          archivo: file,
          base64: base64Completo, 
          mime_type: file.type
        });
        
        this.cdr.detectChanges(); 
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

      const formValues = this.registerForm.value;

      // 1. FORMATEAR FECHA DE NACIMIENTO (De objeto Date a YYYY-MM-DD)
      const fechaNacObj = new Date(formValues.fecha_nacimiento_chofer!);
      const mes = String(fechaNacObj.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaNacObj.getDate()).padStart(2, '0');
      const fechaNacFormatted = `${fechaNacObj.getFullYear()}-${mes}-${dia}`;

      // 2. FORMATEAR FECHA Y HORA DEL SINIESTRO (De "YYYY-MM-DDTHH:mm" a "YYYY-MM-DD HH:mm:ss")
      // Reemplazamos la "T" que pone HTML5 por un espacio para que MySQL lo lea nativo
      let fechaHoraFormatted = formValues.fecha_hora_siniestro?.replace('T', ' ');
      // Le agregamos los segundos al final si no los tiene
      if (fechaHoraFormatted?.length === 16) { 
        fechaHoraFormatted += ':00';
      }

      // 3. CONSTRUIR EL OBJETO "siniestro"
      const siniestroPayload = {
        ...formValues,
        fecha_nacimiento_chofer: fechaNacFormatted,
        fecha_hora_siniestro: fechaHoraFormatted
      };

      // 4. CONSTRUIR EL ARREGLO "multimedias" (Exactamente con las llaves que lee tu PHP)
      const multimediasPayload = this.archivosProcesados.map(item => ({
        evidencia: item.base64,       // Trae la cabecera, PHP la limpiará
        etiqueta: item.archivo.name,  // Nombre del archivo original
        mime_type: item.mime_type     // Ej. 'image/jpeg' o 'video/mp4'
      }));

      // 5. ARMAR EL PAYLOAD FINAL
      // Tu PHP busca $data['siniestro'] y $data['multimedias']
      const payload = {
        siniestro: siniestroPayload,
        multimedias: multimediasPayload
      };

      console.log('Payload enviado a PHP:', payload);

      // 6. LLAMAR AL SERVICIO
      this.accidentService.postAccident(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.mensajeExito = res.data || 'Siniestro y evidencias registrados correctamente.';
          
          // Limpiar formulario y evidencias
          this.registerForm.reset();
          this.archivosProcesados = [];
          this.cdr.detectChanges();
          
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          this.isLoading = false;
          // Mostramos el mensaje de error que configuraste en PHP
          this.mensajeError = err.error?.error || 'Error al registrar el siniestro en el servidor.';
          this.cdr.detectChanges();
          this.snackBar.open(this.mensajeError, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}