import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; // Opcional, por si quieres un menú de 3 puntos
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Header } from '../../shared/header/header';
import { PolicyService } from '../../services/policy-service';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; 

// TODO: Importar tu servicio
// import { PolicyService } from '../../services/policy.service';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    Header, RouterModule
  ],
  templateUrl: './policies.html',
  styleUrl: './policies.scss',
})
export class Policies implements OnInit {
  totalPolizas = 0;
  polizas: any[] = [];
  isLoading = true;

  constructor(
    
    public policyService: PolicyService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPolizas();
  }

  cargarPolizas() {
    this.isLoading = true;
    
    
    this.policyService.getPolicies().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.polizas = data;
          this.totalPolizas = this.polizas.length;
          this.isLoading = false;
          
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Error al cargar pólizas', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
    

    
  }

  editarPoliza(id: number) {
    console.log('Editar póliza ID:', id);
    // TODO: Lógica para abrir modal o navegar a edición
  }

  eliminarPoliza(id: number) {
    Swal.fire({
      title: '¿Dar de baja póliza?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828', // Color rojo de tu CSS
      cancelButtonColor: '#768A96',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.policyService.deletePolicy({'id_poliza': id}).subscribe({
          next: (data) =>{
            Swal.fire('¡Eliminado!', 'La poliza ha sido dado de baja.', 'success');
            this.cargarPolizas();
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar la póliza.', 'error');
          }
        });
      }
    });
    
    
  }
}