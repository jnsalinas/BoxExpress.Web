// src/app/services/base-api.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export class BaseApiService<T, F> {
  constructor(protected http: HttpClient, protected endpoint: string) {}

  getAll(filter?: F): Observable<T[]> {
    return this.http.post<T[]>(`${environment.apiUrl}/${this.endpoint}/search`, filter || {});
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${this.endpoint}/${id}`);
  }

  create(data: T): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${this.endpoint}`, data);
  }

  update(id: number, data: T): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}/${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.endpoint}/${id}`);
  }
}
