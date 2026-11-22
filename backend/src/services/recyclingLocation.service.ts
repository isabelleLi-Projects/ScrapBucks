import { Injectable } from '@nestjs/common';
import { RecyclingLocation } from '../models/recyclingLocation.model';
import { getActiveRecyclingLocations } from '../data-access/recyclingLocation.data';

@Injectable()
export class RecyclingLocationsService {
  async getLocations(): Promise<RecyclingLocation[]> {
    return await getActiveRecyclingLocations();
  }
}