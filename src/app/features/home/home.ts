import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MatCardModule } from '@angular/material/card';
import { SINIESTROS_DUMMY} from '../../core/models/dummyModels/siniestros.mocks';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Header, MatCardModule, MatButtonModule, MatSelectModule, MatInputModule, MatIconModule, RouterModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  dataSource = SINIESTROS_DUMMY

  getAcceptedCount(): number {
    return this.dataSource.filter(s => s.estatus === 2 || s.estatus === 4).length;
  }

  getPendingCount(): number {
    return this.dataSource.filter(s => s.estatus === 3).length;
  }

  getTotalLossCount(): number {
    return this.dataSource.filter(s => s.estatus === 6).length;
  }

  getInsuranceColor(insurance: string): string {
    const colors: {[key: string]: string} = {
      'Qualitas': '#29353C',
      'GNP': '#44576D',
      'AXA': '#768A96',
      'BBVA': '#AAC7D8'
    };
    return colors[insurance] || '#44576D';
  }

  getStatusClass(estatus: number): string {
    if (estatus === 1) return 'status-rejected';
    if (estatus === 2 || estatus === 4) return 'status-accepted';
    if (estatus === 3) return 'status-deductible';
    if (estatus === 6) return 'status-total';
    return '';
  }

  getStatusText(estatus: number): string {
    if (estatus === 1) return 'Rechazado';
    if (estatus === 2 || estatus === 4) return 'Aceptado';
    if (estatus === 3) return 'Con Deducible';
    if (estatus === 6) return 'Pérdida Total';
    return '';
  }

  getStatusIcon(estatus: number): string {
    if (estatus === 1) return 'close';
    if (estatus === 2 || estatus === 4) return 'check';
    if (estatus === 3) return 'attach_money';
    if (estatus === 6) return 'warning';
    return '';
  }
}