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
  imports: [CommonModule,Header, MatCardModule, MatButtonModule, MatSelectModule,MatInputModule, MatIconModule, RouterModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  dataSource = SINIESTROS_DUMMY

}
