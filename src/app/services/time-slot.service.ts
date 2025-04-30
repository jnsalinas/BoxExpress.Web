import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { TimeSlotDto } from '../models/time-slot.dto';
import { TimeSlotFilter } from '../models/time-slot-filter.model';

@Injectable({ providedIn: 'root' })
export class TimeSlotService extends BaseApiService<
  TimeSlotDto,
  TimeSlotFilter
> {
  constructor(http: HttpClient) {
    super(http, 'TimeSlots');
  }
}
