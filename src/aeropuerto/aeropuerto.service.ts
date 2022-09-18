import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line prettier/prettier
import { BusinessError, BusinessErrorException } from '../errores/business_errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRepository.find({
      relations: ['aerolineas'],
    });
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({
        where: { id },
        relations: ['aerolineas'],
      });
    if (!aeropuerto)
      throw new BusinessErrorException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return aeropuerto;
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    if (aeropuerto.codigo.length > 3) {
      throw new BusinessErrorException(
        'El código del aeropuerto no cumple con el formato',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(
    id: string,
    aeropuerto: AeropuertoEntity,
  ): Promise<AeropuertoEntity> {
    const persistedAeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({ where: { id } });
    if (!persistedAeropuerto)
      throw new BusinessErrorException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    if (aeropuerto.codigo.length > 3) {
      throw new BusinessErrorException(
        'El código del aeropuerto no cumple con el formato',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.aeropuertoRepository.save({
      ...persistedAeropuerto,
      ...aeropuerto,
    });
  }

  async delete(id: string) {
    const aeropuerto: AeropuertoEntity =
      await this.aeropuertoRepository.findOne({
        where: { id },
      });
    if (!aeropuerto)
      throw new BusinessErrorException(
        'El aeropuerto con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.aeropuertoRepository.remove(aeropuerto);
  }
}
