import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CityDto } from '../models/city.dto';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseApiService<CityDto, any> {
  constructor(http: HttpClient) {
    super(http, 'cities');
  }
}
