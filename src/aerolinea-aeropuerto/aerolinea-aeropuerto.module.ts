import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaService } from '../aerolinea/aerolinea.service';
import { AeropuertoService } from '../aeropuerto/aeropuerto.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity])],
  providers: [AerolineaService, AeropuertoService, AerolineaAeropuertoService],
  controllers: [AerolineaAeropuertoController],
})
export class AerolineaAeropuertoModule {}
