import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NfcService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  AddNfcPlayer(dataObj: any) {
    const Obj = {
      player_id: btoa(dataObj.player_id.trim().toLowerCase()),
      name: btoa(dataObj.name.trim()),
      dob: dataObj.dob ? this.formatDate(new Date(dataObj.dob)) : "",
      gender: dataObj.gender,
      team_id: dataObj.team_id,
      email: btoa(dataObj.email),
      location_id: dataObj.location_id,
      category: dataObj.category,
      circuit_id: dataObj.circuit_id,
    };
    const url = `${this.baseUrl}RegisterNfcPlayer`;
    return this.http.post(url, Obj);
  }

  getNfcPlayers(params: { type: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}getAllNfcPlayers`, params);
  }

  searchTeam(params: { team_id: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}getTeamDetails`, params);
  }

  registerNfc(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}registerNfc`, data);
  }

  searchChild(params: { searchKey: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}searchChild`, params);
  }

  setChildAsNfc(dataObj: any): Observable<any> {
    const url = `${this.baseUrl}AddChildAsNfcPlayer`;
    return this.http.post(url, dataObj);
  }
}
