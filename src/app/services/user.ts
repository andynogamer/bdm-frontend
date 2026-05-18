import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class User {
  readonly API_URL = "http://localhost:8012/bdmbackend/app/index.php/usuarios";
  users: any[];
  constructor(private http: HttpClient){
    this.users = [];
  }

  getProfile(){
    return this.http.get<any>(this.API_URL + '/profile', {
      withCredentials: true
    });
  }

  getUsers(){
    return this.http.get<any[]>(this.API_URL, {
      withCredentials: true
    });
  }
  postUser(user: any){
    return this.http.post<any>(this.API_URL, user, {
      withCredentials: true
    });
  }
  postLogin(user: any){
    return this.http.post<any>(this.API_URL + '/login', user, {
      withCredentials: true
    })
  }
}
