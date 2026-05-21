import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips'; 
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// TODO: Verifica la ruta de tu servicio
import { AccidentService } from '../../services/accident-service'; 
import { MultimediaService } from '../../services/multimedia-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, Header, MatCardModule, MatButtonModule, 
    MatSelectModule, MatInputModule, MatIconModule, 
    RouterModule, MatChipsModule, MatProgressSpinnerModule,
    ReactiveFormsModule // <-- IMPORTANTE PARA EL BUSCADOR
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  listaSiniestros: any[] = [];
  
  // Variables para la búsqueda
  searchControl = new FormControl('');
  isSearching = false;
  
  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public accidentService: AccidentService, // <-- DESCOMENTADO E INYECTADO
    public multimediaService: MultimediaService
  ) {}

  ngOnInit(): void {
    this.cargarSiniestros();
    this.configurarBuscador(); // Iniciamos el "escucha" del buscador
  }

  // ============ LÓGICA DE BÚSQUEDA ============
  configurarBuscador() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500), // Espera 500ms después de la última tecla
      distinctUntilChanged() // Solo dispara si el texto realmente cambió
    ).subscribe(termino => {
      if (termino && termino.trim().length > 0) {
        this.ejecutarBusqueda(termino.trim());
      } else {
        // Si borraron el texto, volvemos a cargar todos
        this.cargarSiniestros();
      }
    });
  }

  ejecutarBusqueda(termino: string) {
    this.isSearching = true;
    this.cdr.detectChanges();

    this.accidentService.searchAccidents(termino).subscribe({
      next: (data: any[]) => {
        this.listaSiniestros = data.map((s: any) => ({
          ...s,
          safeMultimedia: null 
        }));
        
        this.isSearching = false;
        this.cdr.detectChanges();
        this.cargarVistasPrevias(); // Cargamos imágenes de los resultados
      },
      error: (e) => {
        console.error('Error en la búsqueda:', e);
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ============ LÓGICA DE CARGA INICIAL ============
  cargarSiniestros() {
    this.isSearching = true; // Usamos el mismo estado para la carga inicial
    this.cdr.detectChanges();

    this.accidentService.getAllAccidents().subscribe({
      next: (data: any[]) => {
        this.listaSiniestros = data.map((s: any) => ({
          ...s,
          safeMultimedia: null 
        }));
        
        this.isSearching = false;
        this.cdr.detectChanges();
        this.cargarVistasPrevias(); 
      },
      error: (e) => {
        console.error('Error al cargar siniestros', e);
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método que pide la evidencia 1 por 1 para no trabar la pantalla
  cargarVistasPrevias() {
    this.listaSiniestros.forEach(siniestro => {
      if (siniestro.id_primer_multimedia) {
        
        this.multimediaService.getMultimediaById(siniestro.id_primer_multimedia).subscribe({
          next: (mediaData: any) => {
            const urlString = `${mediaData.evidencia}`;
            siniestro.safeMultimedia = this.sanitizer.bypassSecurityTrustUrl(urlString);
            this.cdr.detectChanges();
          }
        });
        
      }
    });
  }

  // ============ LÓGICA DE ESTADÍSTICAS ============
  getAcceptedCount(): number {
    return this.listaSiniestros.filter(s => s.estatus_actual?.startsWith('ACEPTADO')).length;
  }

  getPendingCount(): number {
    return this.listaSiniestros.filter(s => s.estatus_actual === 'REGISTRADO' || !s.estatus_actual).length;
  }

  getTotalLossCount(): number {
    return this.listaSiniestros.filter(s => s.estatus_actual === 'PÉRDIDA TOTAL, APLICA PAGO COMPLETO DE LA UNIDAD').length;
  }

  // ============ DISEÑO DE TARJETAS ============
  getStatusClass(estatus: string | null): string {
    const e = estatus || 'REGISTRADO';
    switch (e) {
      case 'RECHAZADO': return 'status-rejected';
      case 'ACEPTADO': 
      case 'ACEPTADO SIN PAGO DE DEDUCIBLE': 
      case 'APLICA PAGO PARA REPARACIÓN DE LA UNIDAD': return 'status-accepted';
      case 'ACEPTADO CON PAGO DE DEDUCIBLE': return 'status-deductible';
      case 'PÉRDIDA TOTAL, APLICA PAGO COMPLETO DE LA UNIDAD': return 'status-total';
      case 'REGISTRADO': default: return 'status-pending';
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
      case 'REGISTRADO': default: return 'pending_actions';
    }
  }
}