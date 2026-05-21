import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AccidentService } from '../../services/accident-service';
import { MultimediaService } from '../../services/multimedia-service'; 
// <-- IMPORTA AQUÍ TU NUEVO SERVICIO
import { MessageService } from '../../services/message-service'; 

@Component({
  selector: 'app-accident-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, Header, MatCardModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatTabsModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, MatDividerModule,
    MatProgressSpinnerModule 
  ],
  templateUrl: './accident-detail.html',
  styleUrl: './accident-detail.scss',
})
export class AccidentDetail implements OnInit, AfterViewChecked {
  siniestro: any; 
  isLoading = false;
  listaMultimedia: any[] = []; 
  editForm: FormGroup;

  // --- VARIABLES PARA EL CHAT ---
  mensajes: any[] = [];
  idSesion: number = 0;
  mensajeControl = new FormControl('', [Validators.required, Validators.maxLength(1024)]);
  isSendingMessage = false;
  
  // Referencia al contenedor del chat para hacer autoscroll
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  estatusOptions = [
    'REGISTRADO', 'RECHAZADO', 'ACEPTADO', 
    'ACEPTADO CON PAGO DE DEDUCIBLE', 'ACEPTADO SIN PAGO DE DEDUCIBLE',
    'APLICA PAGO PARA REPARACIÓN DE LA UNIDAD', 'PÉRDIDA TOTAL, APLICA PAGO COMPLETO DE LA UNIDAD'
  ];

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public accidentService: AccidentService,
    public multimediaService: MultimediaService,
    public messageService: MessageService // <-- INYECTADO
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

  // Se ejecuta después de cada actualización de la vista (sirve para el autoscroll del chat)
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  cargarDetalleSiniestro(id: number) {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.accidentService.getAccidentById(id).subscribe({
      next: (data: any) => {
        this.siniestro = Array.isArray(data) ? data[0] : data; 
        this.patchFormValues();
        
        // Disparamos la carga de multimedia y los mensajes del chat
        this.cargarMultimediaSiExiste(this.siniestro.id_siniestro);
        this.cargarMensajes(this.siniestro.id_siniestro);
        
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
  // LÓGICA DEL CHAT Y MENSAJES
  // ==========================================

  cargarMensajes(idSiniestro: number) {
    this.messageService.getMessagesByAccident(idSiniestro).subscribe({
      next: (res: any) => {
        // Asignamos la data a nuestros arreglos locales
        this.mensajes = res.data || [];
        this.idSesion = res.id_sesion;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (e) => {
        console.error('Error al cargar historial de chat:', e);
      }
    });
  }

  enviarMensaje() {
    if (this.mensajeControl.invalid || this.isSendingMessage) return;

    const texto = this.mensajeControl.value?.trim();
    if (!texto) return;

    this.isSendingMessage = true;
    this.cdr.detectChanges();

    const payload = {
      id_siniestro: this.siniestro.id_siniestro,
      texto: texto
    };

    this.messageService.postMessage(payload).subscribe({
      next: () => {
        // Limpiamos el input y bajamos la bandera de carga
        this.mensajeControl.reset();
        this.isSendingMessage = false;
        
        // Volvemos a pedir los mensajes para tener el ID real y la fecha de la Base de Datos
        this.cargarMensajes(this.siniestro.id_siniestro);
      },
      error: (e) => {
        this.isSendingMessage = false;
        this.cdr.detectChanges();
        this.snackBar.open('No se pudo enviar el mensaje', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Función para mantener el scroll siempre abajo en el chat
  scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  // ... (MANTÉN EXACTAMENTE IGUAL EL RESTO DE TUS FUNCIONES: cargarMultimediaSiExiste, patchFormValues, guardarCambios, getStatusClass, getStatusIcon)
  cargarMultimediaSiExiste(idSiniestro: number) {
    this.multimediaService.getMetadataByAccidentId(idSiniestro).subscribe({
      next: (metadata: any[]) => {
        this.listaMultimedia = metadata.map(item => ({ ...item, safeUrl: null }));
        this.cdr.detectChanges();

        this.listaMultimedia.forEach(media => {
          this.multimediaService.getMultimediaById(media.id_multimedia).subscribe({
            next: (blobData: any) => {
              media.safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobData.evidencia);
              this.cdr.detectChanges(); 
            },
            error: (e) => console.error(`Error al cargar la evidencia ${media.id_multimedia}:`, e)
          });
        });
      },
      error: (e) => console.error('Error al cargar metadata de multimedia:', e)
    });
  }

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