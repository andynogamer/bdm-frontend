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
import { User } from '../../services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatTooltipModule, Header, RouterModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  totalUsers = 0;
  totalAdministradores = 0;
  totalAjustadores = 0;
  totalAsegurados = 0;
  
  listaUsers: any[] = [];
  typeUserSelected = "option0";

  constructor(
    public userService: User, 
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        // Pre-calculamos todo antes de pasarlo a la vista
        this.listaUsers = data.map(c => ({
          ...c,
          safeFoto: this.getImageUrl(c.foto), // Mapeado como safeFoto
          safeRoleName: this.getRoleName(c.tipo_usuario)
        }));
        
        this.totalUsers = this.listaUsers.length;
        this.totalAdministradores = this.getUsersByType(2);
        this.totalAjustadores = this.getUsersByType(1);
        this.totalAsegurados = this.getUsersByType(0);
        
        // ¡CORREGIDO! Faltaban los paréntesis ()
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error cargando usuarios:', e);
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

  // ¡CORREGIDO! Ahora busca en listaUsers y no en el servicio
  getUsersByType(tipo: number): number {
    return this.listaUsers.filter(u => u.tipo_usuario === tipo).length;
  }
}