import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../core/models/usuario.model';
import { USUARIOS_DUMMY } from '../../core/models/dummyModels/usuarios.mocks';
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
  imports: [
    CommonModule, MatCardModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatTooltipModule, Header, RouterModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {

  constructor(public user: User, private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers() {
    this.user.getUsers().subscribe({
      next: (data) => {
        this.user.users = data;
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
  getTotalUsers(): number {
    return this.user.users?.length || 0;
  }

  getUsersByType(tipo: number): number {
    return this.user.users?.filter(u => u.tipo_usuario === tipo).length || 0;
  }


  /*
  typeUserSelected = "option0";
  dataSource = USUARIOS_DUMMY;

  constructor(private sanitizer: DomSanitizer) {}

 
  getImageUrl(fotoBlob: Blob): SafeUrl {
    if (!fotoBlob || fotoBlob.size === 0) return 'assets/default-user.png';
    const objectURL = URL.createObjectURL(fotoBlob);
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  
  getRoleName(rol: number): string {
    const roles: { [key: number]: string } = { 1: 'Administrador', 2: 'Ajustador', 3: 'Asegurado' };
    return roles[rol] || 'Usuario';
  }
    */

}