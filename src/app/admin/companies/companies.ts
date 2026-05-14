import { Component, OnInit } from '@angular/core';
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
  imports: [
    CommonModule, MatCardModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatTooltipModule, Header, RouterModule
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies implements OnInit {

  constructor(public company: Company, private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers() {
    this.company.getCompanies().subscribe({
      next: (data) => {
        this.company.companies = data;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
  
  typeUserSelected = "option0";
  
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

  // Métodos para estadísticas
  getTotalCompanies(): number {
    return this.company.companies?.length || 0;
  }

  



}