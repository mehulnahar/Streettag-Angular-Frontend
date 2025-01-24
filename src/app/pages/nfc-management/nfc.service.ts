import { Injectable } from "@angular/core";
import { AjaxService } from "src/app/ajax.service";
import { environment } from "src/environments/environment";
import * as moment from "moment-mini";

@Injectable({
  providedIn: "root",
})
export class NfcService {
  private readonly baseUrl = environment.baseUrl;
  constructor(private ajaxService: AjaxService) {}

  AddNfcPlayer(dataObj: any) {
    const Obj = {
      player_id: btoa(dataObj.player_id.trim().toLowerCase()),
      name: btoa(dataObj.name.trim()),
      dob: dataObj.dob ? moment(dataObj.dob).format("DD/MM/YYYY") : "",
      gender: dataObj.gender,
      team_id: dataObj.team_id,
      email: btoa(dataObj.email),
      location_id: dataObj.location_id,
      category: dataObj.category,
      circuit_id: dataObj.circuit_id,
    };
    const url = `${this.baseUrl}RegisterNfcPlayer`;
    return this.ajaxService.post(Obj, url);
  }

  getNfcPlayers(type :any) {
    const url = `${this.baseUrl}getAllNfcPlayers`;
    return this.ajaxService.post(type,url);
  }

  searchChild(dataObj: any) {
    const url = `${this.baseUrl}searchChild`;
    return this.ajaxService.post(dataObj, url);
  }

  setChildAsNfc(dataObj :any){
    const url = `${this.baseUrl}AddChildAsNfcPlayer`;
    return this.ajaxService.post(dataObj, url);
  } 
}
