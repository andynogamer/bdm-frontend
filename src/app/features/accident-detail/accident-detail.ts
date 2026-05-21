import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- Añadido para el spinner

import { AccidentService } from '../../services/accident-service';
import { MultimediaService } from '../../services/multimedia-service'; // <-- INYECTADO

@Component({
  selector: 'app-accident-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, Header, MatCardModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatTabsModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, MatDividerModule,
    MatProgressSpinnerModule // <-- Añadido
  ],
  templateUrl: './accident-detail.html',
  styleUrl: './accident-detail.scss',
})
export class AccidentDetail implements OnInit {
  siniestro: any; 
  isLoading = false;
  listaMultimedia: any[] = []; 
  editForm: FormGroup;

  estatusOptions = [
    'REGISTRADO',
    'RECHAZADO',
    'ACEPTADO',
    'ACEPTADO CON PAGO DE DEDUCIBLE',
    'ACEPTADO SIN PAGO DE DEDUCIBLE',
    'APLICA PAGO PARA REPARACIÓN DE LA UNIDAD',
    'PÉRDIDA TOTAL, APLICA PAGO COMPLETO DE LA UNIDAD'
  ];

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public accidentService: AccidentService,
    public multimediaService: MultimediaService // <-- AÑADIDO AL CONSTRUCTOR
  ) {
    this.editForm = this.fb.group({
      estatus_siniestro: [''],
      monto_pago: [''],
      monto_deducible_aplicado: [''],
      fecha_compromiso: ['']
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarDetalleSiniestro(id);
    }
  }

  cargarDetalleSiniestro(id: number) {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.accidentService.getAccidentById(id).subscribe({
      next: (data: any) => {
        // Validación por si tu API devuelve [{...}]
        this.siniestro = Array.isArray(data) ? data[0] : data; 
        this.patchFormValues();
        
        // <-- MANDAMOS LLAMAR A LA MULTIMEDIA AHORA SÍ
        this.cargarMultimediaSiExiste(this.siniestro.id_siniestro);
        
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 
      error: (e) => {
        console.error('Error al cargar detalle:', e);
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  // ==========================================
  // NUEVA LÓGICA MULTIMEDIA
  // ==========================================
  cargarMultimediaSiExiste(idSiniestro: number) {
    // 1. Pedimos primero el arreglo ligero de metadata
    this.multimediaService.getMetadataByAccidentId(idSiniestro).subscribe({
      next: (metadata: any[]) => {
        
        // 2. Preparamos el array y le ponemos safeUrl en null para mostrar spinners
        this.listaMultimedia = metadata.map(item => ({
          ...item,
          safeUrl: null
        }));
        this.cdr.detectChanges();

        // 3. Iteramos y pedimos el archivo pesado 1 por 1
        this.listaMultimedia.forEach(media => {
          this.multimediaService.getMultimediaById(media.id_multimedia).subscribe({
            next: (blobData: any) => {
              // Como tu JSON ya trae el string completo con cabecera en "evidencia"
              media.safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobData.evidencia);
              this.cdr.detectChanges(); // Refrescamos la vista para que quite el spinner
            },
            error: (e) => {
              console.error(`Error al cargar la evidencia ${media.id_multimedia}:`, e);
            }
          });
        });

      },
      error: (e) => {
        console.error('Error al cargar metadata de multimedia:', e);
      }
    });
  }

  // ... (El resto de tus métodos siguen exactamente igual: patchFormValues, guardarCambios, getStatusClass, getStatusIcon)
  patchFormValues() {
    this.editForm.patchValue({
      estatus_siniestro: this.siniestro.estatus_actual|| 'REGISTRADO',
      monto_pago: this.siniestro.monto_pago,
      monto_deducible_aplicado: this.siniestro.monto_deducible_aplicado,
      fecha_compromiso: this.siniestro.fecha_compromiso ? new Date(this.siniestro.fecha_compromiso) : null
    });
  }

  guardarCambios() {
    this.isLoading = true;
    this.cdr.detectChanges(); 
    
    const formValues = this.editForm.value;
    let fechaCompromisoFormat = null;
    
    if (formValues.fecha_compromiso) {
      const d = new Date(formValues.fecha_compromiso);
      fechaCompromisoFormat = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    const payload = {
      id_siniestro: this.siniestro.id_siniestro,
      ...formValues,
      fecha_compromiso: fechaCompromisoFormat
    };
    
    this.accidentService.updateAccidentPaymentInformation(payload).subscribe({
      next: (data) => {
        this.siniestro.estatus_actual = formValues.estatus_siniestro;
        this.siniestro.monto_pago = formValues.monto_pago;
        this.siniestro.monto_deducible_aplicado = formValues.monto_deducible_aplicado;
        this.siniestro.fecha_compromiso = formValues.fecha_compromiso; 
        
        this.isLoading = false;
        this.editForm.markAsPristine(); 
        this.cdr.detectChanges(); 

        this.snackBar.open(data.data || data, 'Cerrar', { duration: 3000 });
      },
      error: (e) => {
        this.isLoading = false;
        this.cdr.detectChanges(); 
        this.snackBar.open(e.error?.error || 'Error al actualizar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getStatusClass(estatus: string | null): string {
    const e = estatus || 'REGISTRADO';
    switch (e) {
      case 'RECHAZADO': return 'status-rejected';
      case 'ACEPTADO': 
      case 'ACEPTADO SIN PAGO DE DEDUCIBLE': 
      case 'APLICA PAGO PARA REPARACIÓN DE LA UNIDAD': return 'status-accepted';
      case 'ACEPTADO CON PAGO DE DEDUCIBLE': return 'status-deductible';
      case 'PÉRDIDA TOTAL, APLICA PAGO COMPLETO DE LA UNIDAD': return 'status-total';
      default: return 'status-pending';
    }
  }

  getStatusIcon(estatus: string | null): string {
    const e = estatus || 'REGISTRADO';
    switch (e) {
      case 'RECHAZADO': return 'close';
      case 'ACEPTADO': 
      case 'ACEPTADO SIN PAGO DE DEDUCIBLE': return 'check';
      case 'ACEPTADO CON PAGO DE DEDUCIBLE': 
      case 'APLICA PAGO PARA REPARACIÓN DE LA UNIDAD': return 'attach_money';
      case 'PÉRDIDA TOTAL, APLICA PAGO COMPLETO DE LA UNIDAD': return 'warning';
      default: return 'pending_actions';
    }
  }
}