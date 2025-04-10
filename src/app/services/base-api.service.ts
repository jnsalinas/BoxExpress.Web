// base-api.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/common/api-response';

export class BaseApiService<T, F> {
  constructor(protected http: HttpClient, protected endpoint: string) {}

  protected handleResponse<R>() {
    return map((res: ApiResponse<R>) => {
      if (res.success) return res.data!;
      throw new Error(res.message || 'Error en la respuesta del servidor');
    });
  }

  getAll(filter?: F): Observable<T[]> {
    return this.http
      .post<ApiResponse<T[]>>(
        `${environment.apiUrl}/${this.endpoint}/search`,
        filter || {}
      )
      .pipe(this.handleResponse());
  }

  getById(id: number): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${environment.apiUrl}/${this.endpoint}/${id}`)
      .pipe(this.handleResponse());
  }

  create(data: T): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${environment.apiUrl}/${this.endpoint}`, data)
      .pipe(this.handleResponse());
  }

  update(id: number, data: T): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${environment.apiUrl}/${this.endpoint}/${id}`, data)
      .pipe(this.handleResponse());
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${environment.apiUrl}/${this.endpoint}/${id}`)
      .pipe(
        map((res) => {
          if (res.success) return;
          throw new Error(res.message || 'Error al eliminar');
        })
      );
  }
}
