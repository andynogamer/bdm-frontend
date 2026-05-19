import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Company {
  readonly API_URL = "http://localhost:8012/bdmbackend/app/index.php/companias";
  companies: any[];
  constructor(private http: HttpClient){
    this.companies = [];
  }

  postCompany(company : any){
    return this.http.post<any>(this.API_URL + '/register', company, {
      withCredentials: true
    })
  }

  getCompanies(){
    return this.http.get<any[]>(this.API_URL, {
      withCredentials: true
    });
  }
  getCompaniesWithoutPhoto(){
    return this.http.get<any[]>(this.API_URL + '/list', {
      withCredentials: true
    });
  }
  
}
