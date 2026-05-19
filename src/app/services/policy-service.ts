import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  readonly API_URL = "http://localhost:8012/bdmbackend/app/index.php/polizas";

}
