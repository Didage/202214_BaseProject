import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmConfiguracionPruebas } from '../testing/typeorm-configuracion-pruebas';

import { faker } from '@faker-js/faker';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfiguracionPruebas()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        id: faker.lorem.sentence(),
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaDeFundacion: faker.date.recent(),
        paginaWeb: faker.internet.url(),
        aeropuertos: [],
      });
      aerolineasList.push(aerolinea);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(
      storedAerolinea.id,
    );
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre);
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion);
    // eslint-disable-next-line prettier/prettier
    expect(aerolinea.fechaDeFundacion).toEqual(storedAerolinea.fechaDeFundacion);
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb);
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El aerolinea con el id dado no fue encontrado',
    );
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: faker.lorem.sentence(),
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaDeFundacion: faker.date.recent(),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
    };

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: newAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre);
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion);
    // eslint-disable-next-line prettier/prettier
    expect(storedAerolinea.fechaDeFundacion).toEqual(newAerolinea.fechaDeFundacion);
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb);
  });

  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.nombre = 'New name';
    aerolinea.descripcion = 'New descripcion';
    aerolinea.fechaDeFundacion = faker.date.recent();
    aerolinea.paginaWeb = faker.internet.url();

    const updatedAerolinea: AerolineaEntity = await service.update(
      aerolinea.id,
      aerolinea,
    );
    expect(updatedAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre);
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion);
    // eslint-disable-next-line prettier/prettier
    expect(storedAerolinea.fechaDeFundacion).toEqual(aerolinea.fechaDeFundacion);
    expect(storedAerolinea.paginaWeb).toEqual(aerolinea.paginaWeb);
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea,
      nombre: 'New name',
      descripcion: 'New descripcion',
      fechaDeFundacion: faker.date.recent(),
      paginaWeb: faker.internet.url(),
    };
    await expect(() => service.update('0', aerolinea)).rejects.toHaveProperty(
      'message',
      'El aerolinea con el id dado no fue encontrado',
    );
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);

    const deletedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El aerolinea con el id dado no fue encontrado',
    );
  });
});
