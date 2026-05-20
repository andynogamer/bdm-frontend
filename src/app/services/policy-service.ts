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

  getPolicyById(id: number){
    return this.http.get<any>(this.API_URL + `/get/${id}`, {
      withCredentials: true
    });
  }

  updatePolicy(payload : any){
    return this.http.post<any>(this.API_URL + '/update', payload, {
      withCredentials: true
    })
  }

  deletePolicy(policy: any){
    return this.http.post<any>(this.API_URL + '/delete', policy ,{
      withCredentials: true
    });
  }

  getPolicies(){
    return this.http.get<any[]>(this.API_URL, {
      withCredentials: true
    });
  }

  postPolicy(policy: any){
    return this.http.post<any>(this.API_URL + '/register', policy ,{
      withCredentials: true
    });
  }

}
