import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  readonly API_URL = "http://localhost:8012/bdmbackend/app/index.php/polizas";
  policies: any[];
  constructor(private http: HttpClient){
    this.policies = []
  }

  postPolicy(policy: any){
    return this.http.post<any>(this.API_URL + '/register', policy ,{
      withCredentials: true
    })
  }

}
