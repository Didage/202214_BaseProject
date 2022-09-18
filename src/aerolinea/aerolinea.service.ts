import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line prettier/prettier
import { BusinessError, BusinessErrorException } from '../errores/business_errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRepository: Repository<AerolineaEntity>,
  ) {}

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRepository.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessErrorException(
        'La aerolinea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return aerolinea;
  }

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const fechaActual = new Date();
    const fechaDeFundacion = new Date(aerolinea.fechaDeFundacion);

    if (fechaDeFundacion.getTime() > fechaActual.getTime()) {
      throw new BusinessErrorException(
        'La fecha de fundación de la aerolínea no es válida.',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.aerolineaRepository.save(aerolinea);
  }

  async update(
    id: string,
    aerolinea: AerolineaEntity,
  ): Promise<AerolineaEntity> {
    const persistedAerolinea: AerolineaEntity =
      await this.aerolineaRepository.findOne({ where: { id } });
    if (!persistedAerolinea)
      throw new BusinessErrorException(
        'La aerolinea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const fechaActual = new Date();
    const fechaDeFundacion = new Date(aerolinea.fechaDeFundacion);
    if (fechaDeFundacion.getTime() > fechaActual.getTime()) {
      throw new BusinessErrorException(
        'La fecha de fundación de la aerolínea no es válida.',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.aerolineaRepository.save({
      ...persistedAerolinea,
      ...aerolinea,
    });
  }

  async delete(id: string) {
    const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
      where: { id },
    });
    if (!aerolinea)
      throw new BusinessErrorException(
        'La aerolinea con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    await this.aerolineaRepository.remove(aerolinea);
  }
}
