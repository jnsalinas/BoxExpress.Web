import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/common/api-response';
import { PaginationDto } from '../models/common/pagination.dto';

export class BaseApiService<T, F> {
  constructor(protected http: HttpClient, protected endpoint: string) {}

  protected handleResponse<R>() {
    return map((res: ApiResponse<R>) => {
      if (res.success) {
        return res.data!;
      }
      throw new Error(res.message || 'Error en la respuesta del servidor');
    });
  }

  export(filter: F): Observable<Blob> {
    return this.http.post<Blob>(
      `${environment.apiUrl}/${this.endpoint}/export`,
      filter,
      {
        responseType: 'blob' as 'json',
      } 
    );
  }

  getAll(filter?: F): Observable<{ data: T[]; pagination: PaginationDto }> {
    return this.http
      .post<ApiResponse<{ data: T[]; pagination: PaginationDto }>>(
        `${environment.apiUrl}/${this.endpoint}/search`,
        filter || {}
      )
      .pipe(
        map((res: ApiResponse<{ data: T[]; pagination: PaginationDto }>) => {
          if (res.success) {
            if (res.data && Array.isArray(res.data)) {
              return {
                data: res.data, // Datos de los elementos
                pagination: res.pagination || ({} as PaginationDto), // Información de paginación
              };
            }

            throw new Error(
              'La respuesta del servidor no contiene los datos esperados'
            );
          }
          throw new Error(res.message || 'Error en la respuesta del servidor');
        }),
        catchError((error) => {
          console.error('Error en la respuesta:', error);
          return throwError(() => new Error('Error en la solicitud'));
        })
      );
  }

  // Obtener un elemento por su ID
  getById(id: number): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${environment.apiUrl}/${this.endpoint}/${id}`)
      .pipe(
        map((res: ApiResponse<T>) => {
          if (res.success) {
            return res.data!; // Extraemos solo la propiedad 'data'
          }
          throw new Error(res.message || 'Error al obtener el dato');
        })
      );
  }

  create(data: T, action: string = ''): Observable<T> {
    const url = action
      ? `${environment.apiUrl}/${this.endpoint}/${action}`
      : `${environment.apiUrl}/${this.endpoint}`;

    return this.http
      .post<ApiResponse<T>>(url, data, )
      .pipe(this.handleResponse());
  }

  // Actualizar un elemento por su ID
  update(id: number, data: T): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${environment.apiUrl}/${this.endpoint}/${id}`, data)
      .pipe(
        map((res: ApiResponse<T>) => {
          if (res.success) {
            return res.data!; // Extraemos solo la propiedad 'data'
          }
          throw new Error(res.message || 'Error al actualizar el dato');
        })
      );
  }

  // Eliminar un elemento por su ID
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
