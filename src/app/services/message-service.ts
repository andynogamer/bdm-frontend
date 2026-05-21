import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // Ajusta el puerto o ruta base si en algún momento la cambias en tu entorno
  private API_URL = 'http://localhost:8012/bdmbackend/app/index.php/mensajes'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los mensajes de un siniestro específico junto con el ID del usuario en sesión.
   * Devuelve: { data: [...], id_sesion: number }
   */
  getMessagesByAccident(idSiniestro: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getall/${idSiniestro}`, {
      withCredentials: true
    });
  }

  /**
   * Registra un nuevo mensaje en el siniestro.
   * Payload esperado: { id_siniestro: number, texto: string }
   */
  postMessage(payload: { id_siniestro: number, texto: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, payload, {
      withCredentials: true
    });
  }
}