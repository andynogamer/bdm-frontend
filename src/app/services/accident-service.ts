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


  /**
   * Busca siniestros basados en el número de póliza, placas o nombre del cliente.
   * El backend determinará los permisos basados en la sesión activa.
   * @param termino El string de búsqueda ingresado por el usuario
   */
  searchAccidents(termino: string): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.API_URL}/search/${termino}`, {
      withCredentials: true
    });
  }

  postAccident(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL + '/register', payload, {
      withCredentials: true
    });
  }

  updateAccidentPaymentInformation(payload: any): Observable<any> {
    return this.http.post<any>(this.API_URL + '/admin/update', payload, {
      withCredentials: true
    });
  }

  getAllAccidents(){
    return this.http.get<any[]>(this.API_URL, {
      withCredentials: true
    })

  }

  getAccidentById(id: number){
    return this.http.get<any>(this.API_URL + `/get/${id}`, {
      withCredentials: true
    })
  }
}