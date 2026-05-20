import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../services/user';
import { Company } from '../../services/company';
import { PolicyService } from '../../services/policy-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-policy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    Header,
    MatSnackBarModule
  ],
  templateUrl: './edit-policy.html',
  styleUrl: './edit-policy.scss',
})
export class EditPolicy implements OnInit {
  idPoliza: number = 0;
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';

  companias: any[] = []; 
  asegurados: any[] = [];

  editForm = new FormGroup({
    porcentaje_deducible: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    id_compania: new FormControl('', [Validators.required]),
    id_asegurado: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    anio: new FormControl('', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]),
    color: new FormControl('', [Validators.required]),
    placas: new FormControl('', [Validators.required]),
    numero_serie: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.min(0)])
  });

  constructor(
    private snackBar: MatSnackBar,
    public userService: User,
    public companyService: Company,
    public policyService: PolicyService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idPoliza = Number(id);
      // Cargamos los catálogos antes de traer la póliza para que los selects se enlacen correctamente
      this.cargarCompanias();
      this.cargarAsegurados();
      this.cargarDatosPoliza(this.idPoliza);
    } else {
      this.router.navigate(['/policies']); // Ajusta esta ruta a la de tu tabla
    }
  }

  get deducibleFC() { return this.editForm.get('porcentaje_deducible'); }
  get companiaFC() { return this.editForm.get('id_compania'); }
  get aseguradoFC() { return this.editForm.get('id_asegurado'); }

  cargarCompanias() {
    this.companyService.getCompaniesWithoutPhoto().subscribe({
      next: (data) => {
        this.companias = data;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al cargar compañias:', e);
        this.snackBar.open('Error al cargar la lista de compañías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarAsegurados() {
    this.userService.getAllInsured().subscribe({
      next: (data) => {
        this.asegurados = data;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al cargar asegurados:', e);
        this.snackBar.open('Error al cargar la lista de asegurados', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarDatosPoliza(id: number) {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.policyService.getPolicyById(id).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        
        // Asumiendo que las llaves del JSON que devuelve tu API coinciden con los nombres de los FormControl
        this.editForm.patchValue({
          porcentaje_deducible: data.porcentaje_deducible,
          id_compania: data.id_compania,
          id_asegurado: data.id_asegurado,
          marca: data.vehiculo_marca,
          modelo: data.vehiculo_modelo,
          anio: data.vehiculo_anio,
          color: data.color,
          placas: data.placas,
          numero_serie: data.numero_serie,
          valor: data.valor_vehiculo
        });

        this.cdr.detectChanges();
      },
      error: (e) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Error al cargar la póliza', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/policies']); // Redirigimos si la póliza no existe
      }
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.isLoading = true;
      this.cdr.detectChanges();

      // Construimos el payload enviando los datos del formulario y el ID
      const payload : any = { 
        id_poliza: this.idPoliza,
        porcentaje_deducible: this.editForm.value.porcentaje_deducible,
        id_compania: this.editForm.value.id_compania,
        id_asegurado: this.editForm.value.id_asegurado,
        marca: this.editForm.value.marca,
        modelo: this.editForm.value.modelo,
        anio: this.editForm.value.anio,
        color: this.editForm.value.color,
        placas: this.editForm.value.placas,
        numero_serie: this.editForm.value.numero_serie,
        valor: this.editForm.value.valor
      };

      this.policyService.updatePolicy(payload).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.snackBar.open('Póliza actualizada correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/policies']); // Ajusta a tu ruta principal de pólizas
        },
        error: (e) => {
          this.isLoading = false;
          this.mensajeError = e.error?.error || 'Ocurrió un error al actualizar la póliza.';
          this.cdr.detectChanges();
          this.snackBar.open(this.mensajeError, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}