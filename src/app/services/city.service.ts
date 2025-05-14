import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {City} from "../models/city.dto";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private baseUrl = `${environment.apiUrl}/City/getall`;
  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    return this.http.post<{ success: boolean; data: City[] }>(this.baseUrl,{})
      .pipe(map(response => response.data));
  }
}
