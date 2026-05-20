import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccidentService {
  // TODO: Ajusta esta URL a la ruta real de tu API para siniestros
  private API_URL = 'http://localhost:8012/bdmbackend/app/index.php/siniestros'; 

  constructor(private http: HttpClient) { }

  postAccident(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL + '/register', payload, {
      withCredentials: true
    });
  }
}