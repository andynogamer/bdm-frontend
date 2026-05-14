import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Company } from '../../services/company';

@Component({
  selector: 'app-companies',
  standalone: true, // Angular 21 requiere esto si no usas módulos
  imports: [
    CommonModule, MatCardModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatTooltipModule, Header, RouterModule
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies implements OnInit {
  totalCompanies = 0;
  // 1. CREAMOS UNA VARIABLE LOCAL PARA GUARDAR LA DATA
  listaCompanias: any[] = []; 

  constructor(
    public companyService: Company, // 2. RENOMBRAMOS EL SERVICIO PARA EVITAR COLISIONES
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.getCompanies();
  }
  
  getCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (data: any[]) => {
        // 3. ASIGNAMOS A LA VARIABLE LOCAL Y PRE-CARGAMOS LAS IMÁGENES
        this.listaCompanias = data.map(c => ({
          ...c,
          safeLogo: this.getImageUrl(c.logo) 
        }));
        
        this.totalCompanies = this.listaCompanias.length;
        
        // 4. AVISAMOS A ANGULAR QUE LA DATA ESTÁ LISTA
        this.cdr.detectChanges(); 
      },
      error: (e) => {
        console.error('Error al cargar compañias:', e);
      }
    });
  }
  
  getRoleName(rol: number): string {
    const roles: { [key: number]: string } = { 2: 'Administrador', 1: 'Ajustador', 0: 'Asegurado' };
    return roles[rol] || 'Usuario';
  }

  getImageUrl(fotoBase64: string | null): SafeUrl {
    if (!fotoBase64) {
      return 'assets/default-user.png';
    }
    const header = 'data:image/png;base64,'; 
    return this.sanitizer.bypassSecurityTrustUrl(header + fotoBase64);
  }
}