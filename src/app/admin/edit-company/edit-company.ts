import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { Company } from '../../services/company';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    Header
  ],
  templateUrl: './edit-company.html',
  styleUrl: './edit-company.scss',
})
export class EditCompany implements OnInit {

  idCompania: number = 0;
  selectedFile: File | null = null;
  selectedFilePreview: SafeUrl | string | null = null; 
  selectedFileName: string = '';
  isLoading = false;
  mensajeError = '';
  mensajeExito = '';

  editForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    logo: new FormControl(''),
  });

  constructor(
    public companyService: Company,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef // <-- INYECTADO CORRECTAMENTE
  ) { }

  get nameFC() { return this.editForm.get('nombre'); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idCompania = Number(id);
      this.cargarDatosCompania(this.idCompania);
    } else {
      this.router.navigate(['/companies']);
    }
  }

  getImageUrl(fotoBase64: string | null): SafeUrl | string {
    if (!fotoBase64) {
      return 'default-company.png';
    }
    const header = 'data:image/png;base64,'; 
    return this.sanitizer.bypassSecurityTrustUrl(fotoBase64);
  }

  cargarDatosCompania(id: number) {
    this.isLoading = true;
    this.companyService.getCompanyById(id).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        
        this.editForm.patchValue({
          nombre: data.nombre,
          logo: data.logo 
        });

        if (data.logo) {
          this.selectedFilePreview = this.getImageUrl(data.logo);
        }
        
        // <-- FORZAMOS DETECCIÓN DE CAMBIOS PARA ACTUALIZAR LA VISTA
        this.cdr.detectChanges(); 
      },
      error: (e) => {
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- ACTUALIZAMOS SPINNER DE CARGA
        this.snackBar.open('Error al cargar la compañía', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/companies']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();

      reader.onload = () => {
        const base64Completo = reader.result as string; 
        
        this.selectedFilePreview = this.sanitizer.bypassSecurityTrustUrl(base64Completo);
        
        const base64Puro = base64Completo.split(',')[1];
        
        this.editForm.patchValue({ logo: base64Puro });
        
        // <-- EL FILEREADER SE EJECUTA FUERA DE ANGULAR, AQUÍ EL CDR ES VITAL
        this.cdr.detectChanges(); 
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.editForm.patchValue({ logo: '' });
    this.editForm.get('logo')?.updateValueAndValidity();
    
    // <-- NOTIFICAMOS QUE SE BORRÓ LA IMAGEN
    this.cdr.detectChanges(); 
  }

  onSubmit() {
    if (this.editForm.invalid) return;
    
    this.isLoading = true;
    this.cdr.detectChanges(); // <-- MOSTRAMOS ESTADO DE CARGA EN BOTÓN
    
    const payload = { ...this.editForm.value, id_compania: this.idCompania };
    /*
    this.companyService.updateCompany(payload).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Compañía actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/companies']);
      },
      error: (e) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open(e.error?.error || 'Error al actualizar', 'Cerrar', { duration: 3000 });
      }
    });
    */
  }
}