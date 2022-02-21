import { Resolver, Query } from '@nestjs/graphql';
import { ZoneService } from './zone.service';
import { Zone } from './entities/zone.entity';

@Resolver(() => Zone)
export class ZoneResolver {
  constructor(private readonly zoneService: ZoneService) {}

  @Query(() => [Zone], { name: 'zone' })
  findAll() {
    return {};
  }
}
