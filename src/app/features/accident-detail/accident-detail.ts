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
import { AccidentService } from '../../services/accident-service';

// TODO: Importa tu servicio real
// import { AccidentService } from '../../services/accident.service';

@Component({
  selector: 'app-accident-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, Header, MatCardModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatTabsModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, MatDividerModule
  ],
  templateUrl: './accident-detail.html',
  styleUrl: './accident-detail.scss',
})
export class AccidentDetail implements OnInit {
  siniestro: any; // Aquí guardaremos la data tal cual viene de vw_info_siniestros
  isLoading = false;
  
  // Array de multimedia (puedes llenarlo con otra petición a la API)
  listaMultimedia: any[] = []; 

  // Formulario para los datos editables (Admin)
  editForm: FormGroup;

  // Catálogo de estatus obligatorios
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
    public accidentService: AccidentService
  ) {
    // Inicializamos el formulario
    this.editForm = this.fb.group({
      estatus_actual: [''],
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
    
    // TODO: Llama a tu API SELECT_ONE
    
    this.accidentService.getAccidentById(id).subscribe({
      next: (data) => {
        this.siniestro = data;
        this.patchFormValues();
        //this.cargarMultimediaSiExiste();
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
    

    
    
  }

  patchFormValues() {
    this.editForm.patchValue({
      estatus_actual: this.siniestro.estatus_actual || 'REGISTRADO',
      monto_pago: this.siniestro.monto_pago,
      monto_deducible_aplicado: this.siniestro.monto_deducible_aplicado,
      fecha_compromiso: this.siniestro.fecha_compromiso ? new Date(this.siniestro.fecha_compromiso) : null
    });
  }

  guardarCambios() {
    this.isLoading = true;
    
    // Formateamos la fecha si existe para mandarla como YYYY-MM-DD
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

    console.log('Datos a actualizar:', payload);
    
    // Simulación de éxito
    setTimeout(() => {
      this.siniestro.estatus_actual = formValues.estatus_actual;
      this.siniestro.monto_pago = formValues.monto_pago;
      this.siniestro.monto_deducible_aplicado = formValues.monto_deducible_aplicado;
      this.siniestro.fecha_compromiso = fechaCompromisoFormat;
      
      this.isLoading = false;
      this.snackBar.open('Datos actualizados correctamente', 'Cerrar', { duration: 3000 });
      this.cdr.detectChanges();
    }, 1000);
  }

  // Lógica gráfica para los estatus (reutilizada)
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