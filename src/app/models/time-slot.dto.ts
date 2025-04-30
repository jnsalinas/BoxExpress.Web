import { BaseDto } from './common/base.dto';

export interface TimeSlotDto extends BaseDto {
    startTime?: string;
    endTime?: number;
}