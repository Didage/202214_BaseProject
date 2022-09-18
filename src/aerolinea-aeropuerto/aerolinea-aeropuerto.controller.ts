/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AeropuertoService } from '../aeropuerto/aeropuerto.service';
import { BusinessErrorsInterceptor } from '../errores/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';



@UseInterceptors(BusinessErrorsInterceptor)
@Controller('aerolineas')
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
        private readonly servicioAeropuerto: AeropuertoService,){}

    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.addAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAeropuertoByAerolineaIdAeropuertoId(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.findAeropuertoByAerolineaIdAeropuertoId(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos')
    async findAeropuertosByAerolineaId(@Param('aerolineaId') aerolineaId: string){
        return await this.aerolineaAeropuertoService.findAeropuertosByAerolineaId(aerolineaId);
    }

    @Put(':aerolineaId/aeropuertos')
    async associateAerolineaAeropuertos(@Body() aeropuertosIds: string[], @Param('aerolineaId') aerolineaId: string,) {
        const aeropuertos: AeropuertoEntity[] = [];
        for (let i = 0; i < aeropuertosIds.length; i++) {
          const aeropuerto = await this.servicioAeropuerto.findOne(aeropuertosIds[i]);
          aeropuertos.push(aeropuerto);
        }
    
        return await this.aerolineaAeropuertoService.associateAeropuertosAerolinea(
          aerolineaId,
          aeropuertos,
        );
    }

    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.aerolineaAeropuertoService.deleteAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }
}
