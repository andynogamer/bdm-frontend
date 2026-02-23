import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { Usuario } from '../../core/models/usuario.model';
import { USUARIOS_DUMMY } from '../../core/models/dummyModels/usuarios.mocks';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule, MatCardModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatTooltipModule, Header, RouterModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
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
}
