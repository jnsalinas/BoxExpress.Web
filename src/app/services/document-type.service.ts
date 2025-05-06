import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { DocumentTypeDto } from '../models/document-type.dto';
import { DocumentTypeFilter } from '../models/document-type-filter.model';

@Injectable({ providedIn: 'root' })
export class DocumentTypeService extends BaseApiService<
  DocumentTypeDto,
  DocumentTypeFilter
> {
  constructor(http: HttpClient) {
    super(http, 'DocumentTypes');
  }
}
