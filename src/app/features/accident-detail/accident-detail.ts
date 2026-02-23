import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Siniestro } from '../../core/models/siniestro.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SINIESTROS_DUMMY } from '../../core/models/dummyModels/siniestros.mocks';

@Component({
  selector: 'app-accident-detail',
  imports: [
    CommonModule, Header, MatCardModule, MatButtonModule, MatIconModule, 
    MatChipsModule, MatTabsModule, MatInputModule, RouterModule
  ],
  templateUrl: './accident-detail.html',
  styleUrl: './accident-detail.scss',
})
export class AccidentDetail implements OnInit {
  siniestro?: Siniestro;
  images: SafeUrl[] = [];

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //this.siniestro = SINIESTROS_DUMMY.find(s => s.id === id);
    this.siniestro = SINIESTROS_DUMMY[0];
    if (this.siniestro?.multimedia) {
      this.images = this.siniestro.multimedia.map(blob => 
        this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
      );
    }
  }

  getStatusName(id: number): string {
    const status: any = { 1: 'Rechazado', 2: 'Aceptado', 3: 'Con Deducible', 6: 'Pérdida Total' };
    return status[id] || 'Pendiente';
  }
}
