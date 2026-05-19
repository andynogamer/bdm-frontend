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

// TODO: Importar tu servicio correspondiente cuando lo conectes a la API
// import { PolicyService } from '../../services/policy.service';

@Component({
  selector: 'app-register-policy',
  standalone: true, // Asumiendo que usas standalone components según tu código original
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
  templateUrl: './register-policy.html',
  styleUrl: './register-policy.scss',
})
export class RegisterPolicy implements OnInit {
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';

  // Arrays temporales para los selects. ¡Llénalos desde tu API!
  companias: any[] = []; 
  asegurados: any[] = [];

  registerForm = new FormGroup({
    // --- Datos de la Póliza ---
    
    porcentaje_deducible: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    id_compania: new FormControl('', [Validators.required]),
    id_asegurado: new FormControl('', [Validators.required]),
    
    // --- Datos de la Unidad ---
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
    private cdr: ChangeDetectorRef
    
  ) { }

  ngOnInit() {
    // Aquí puedes llamar a tu API para cargar los catálogos de compañías y asegurados
    this.cargarCompanias();
    this.cargarAsegurados();
  }

  // Getters para facilitar validaciones en el HTML
  
  get deducibleFC() { return this.registerForm.get('porcentaje_deducible'); }
  get companiaFC() { return this.registerForm.get('id_compania'); }
  get aseguradoFC() { return this.registerForm.get('id_asegurado'); }

  cargarAsegurados() {
    this.userService.getAllInsured().subscribe({
      next: (data) => {
        // data ya trae tu arreglo de objetos [{id_usuario: 1, alias: "JUANCA90", ...}]
        this.asegurados = data;
      },
      error: (e) => {
        console.error('Error al cargar asegurados:', e);
        this.snackBar.open('Error al cargar la lista de asegurados', 'Cerrar', { duration: 3000 });
      }
    });
  }
  cargarCompanias(){
    this.companyService.getCompaniesWithoutPhoto().subscribe({
      next: (data)=>{
        this.companias = data;

      },
      error:(e) => {
        console.error('Error al cargar compañias:', e);
        this.snackBar.open('Error al cargar la lista de asegurados', 'Cerrar', { duration: 3000 });
      }
    })
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log('Datos a enviar:', this.registerForm.value);

      
      this.policyService.postPolicy(this.registerForm.value).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.mensajeExito = 'Póliza y unidad registradas correctamente.';
          this.registerForm.reset();
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
        },
        error: (e) => {
          this.isLoading = false;
          this.mensajeError = e.error?.error || 'Ocurrió un error al registrar.';
          this.snackBar.open(this.mensajeError, 'Cerrar', { duration: 3000 });
        }
      });
      
    }
  }
}