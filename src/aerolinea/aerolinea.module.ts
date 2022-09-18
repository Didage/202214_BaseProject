import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';

@Module({
  providers: [AerolineaService]
})
export class AerolineaModule {}
