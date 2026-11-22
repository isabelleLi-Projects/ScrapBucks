import { Controller, Get } from '@nestjs/common';
import { RecyclingLocationsService } from '../services/recyclingLocation.service';
import { RecyclingLocation } from '../models/recyclingLocation.model';

// prefixes routes with /recycling-locations
@Controller('recycling-locations')
export class RecyclingLocationsController {
  constructor(
    private readonly recyclingLocationsService: RecyclingLocationsService,
  ) {}

  @Get()
  async getLocations(): Promise<RecyclingLocation[]> {
    return this.recyclingLocationsService.getLocations();
  }
}
// import { Controller, Get, Query } from '@nestjs/common';
// import { RecyclingLocationsService } from './recycling-locations.service';


// @Controller('recycling-locations')
// export class RecyclingLocationsController {
//   constructor(
//     private readonly recyclingLocationsService: RecyclingLocationsService,
//   ) {}

//   @Get()
//   async getLocations(
//     @Query('north') north: string,
//     @Query('south') south: string,
//     @Query('east') east: string,
//     @Query('west') west: string,
//   ) {
//     return this.recyclingLocationsService.findWithinBounds(
//       Number(north),
//       Number(south),
//       Number(east),
//       Number(west),
//     );
//   }
// }
// Then add the database query in your service: