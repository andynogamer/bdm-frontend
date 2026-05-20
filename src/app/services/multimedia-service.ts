import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  // TODO: Ajusta esta URL a la ruta real de tu API para siniestros
  private API_URL = 'http://localhost:8012/bdmbackend/app/index.php/multimedia'; 

  constructor(private http: HttpClient) { }


  getMultimediaById(id: number){
    return this.http.get<any[]>(this.API_URL + `/get/${id}`, {
      withCredentials: true
    })

  }
}
