/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';

import { TypeOrmConfiguracionPruebas } from '../testing/typeorm-configuracion-pruebas';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

describe('AerolineaAeropuertoService', () => {
  let servicio: AerolineaAeropuertoService;
  let repositorioAerolinea: Repository<AerolineaEntity>;
  let repositorioAeropuerto: Repository<AeropuertoEntity>;
  let listaAeropuertos: AeropuertoEntity[];
  let aerolinea: AerolineaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfiguracionPruebas()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    servicio = module.get<AerolineaAeropuertoService>(
      AerolineaAeropuertoService,
    );

    repositorioAerolinea = module.get<
      Repository<AerolineaEntity>
    >(getRepositoryToken(AerolineaEntity));

    repositorioAeropuerto = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await inicializarBaseDeDatos();
  });

  const inicializarBaseDeDatos = async () => {
    repositorioAeropuerto.clear();
    repositorioAerolinea.clear();

    listaAeropuertos = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
        nombre: faker.lorem.sentence(),
        codigo: faker.random.alpha(3),
        pais: faker.lorem.word(),
        ciudad: faker.lorem.word(),
        aerolineas: [],
      });
      listaAeropuertos.push(aeropuerto);
    }

    aerolinea = await repositorioAerolinea.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaDeFundacion: '2000-10-10',
      paginaWeb: faker.internet.url(),
      aeropuertos: listaAeropuertos,
    });
  };

  it('debería estar definido', () => {
    expect(servicio).toBeDefined();
  });

  it('agregarAeropuertoAerolinea debería agregar aeropuerto a aerolinea gastronómica.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.random.alpha(3),
      pais: faker.lorem.word(),
      ciudad: faker.lorem.word(),
      aerolineas: [],
    });

    const nuevaAerolinea: AerolineaEntity =
      await repositorioAerolinea.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaDeFundacion: '2000-10-10',
        paginaWeb: faker.internet.url(),
        aeropuertos: [],
      });

    const result: AerolineaEntity =
      await servicio.addAeropuertoAerolinea(
        nuevaAerolinea.id,
        nuevoAeropuerto.id,
      );

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(nuevoAeropuerto.nombre);
    expect(result.aeropuertos[0].ciudad).toBe(nuevoAeropuerto.ciudad);
    expect(result.aeropuertos[0].codigo).toBe(nuevoAeropuerto.codigo);
    expect(result.aeropuertos[0].pais).toBe(nuevoAeropuerto.pais);
  });

  it('agregarAeropuertoAerolinea debería arrojar excepcion de aeropuerto inválida.', async () => {
    const nuevaAerolinea: AerolineaEntity =
      await repositorioAerolinea.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaDeFundacion: '2000-10-10',
        paginaWeb: faker.internet.url(),
        aeropuertos: [],
      });

    await expect(() =>
      servicio.addAeropuertoAerolinea(nuevaAerolinea.id, '0'),
    ).rejects.toHaveProperty('message', 'El aeropuerto con el id especificado no fue encontrado');
  });

  it('agregarAeropuertoAerolinea debería arrojar excepcion de aerolinea gastronómica inválida.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.random.alpha(3),
      pais: faker.lorem.word(),
      ciudad: faker.lorem.word(),
      aerolineas: [],
    });

    await expect(() =>
      servicio.addAeropuertoAerolinea('0', nuevoAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id especificado no fue encontrada',
    );
  });

  it('findAeropuertoAerolinea debería retornar una aeropuerto de la aerolinea.', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    const aeropuertoAlmacenada: AeropuertoEntity =
      await servicio.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, aeropuerto.id);
    expect(aeropuertoAlmacenada).not.toBeNull();
    expect(aeropuertoAlmacenada.nombre).toBe(aeropuerto.nombre);
    expect(aeropuertoAlmacenada.ciudad).toBe(aeropuerto.ciudad);
    expect(aeropuertoAlmacenada.codigo).toBe(aeropuerto.codigo);
    expect(aeropuertoAlmacenada.pais).toBe(aeropuerto.pais);
  });

  it('findAeropuertoAerolinea debería arrojar excepcion de aeropuerto inválido.', async () => {
    await expect(() =>
      servicio.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, '0'),
    ).rejects.toHaveProperty('message', 'El aeropuerto con el id especificado no fue encontrado');
  });

  it('findAeropuertoAerolinea debería arrojar excepcion de aerolinea inválida.', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    await expect(() =>
      servicio.findAeropuertoByAerolineaIdAeropuertoId('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id especificado no fue encontrada',
    );
  });

  it('findAeropuertoAerolinea debería arrojar excepcion de aeropuerto no asociado a aerolinea.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.random.alpha(3),
      pais: faker.lorem.word(),
      ciudad: faker.lorem.word(),
      aerolineas: [],
    });

    await expect(() =>
      servicio.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, nuevoAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no está asociada a la aerolinea',
    );
  });

  it('findAllAeropuertosDeAerolinea should return aeropuertos by aerolinea', async () => {
    const aeropuertos: AeropuertoEntity[] =
      await servicio.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos.length).toBe(5);
  });

  it('obtenerTodasAeropuertosDeAerolinea debería arrojar excepcion de aerolinea gastronómica inválida.', async () => {
    await expect(() =>
      servicio.findAeropuertosByAerolineaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id especificado no fue encontrada',
    );
  });

  it('asociarAeropuertosAerolinea debería actualizar la lista de aeropuertos de una aerolinea gastronómica.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.random.alpha(3),
      pais: faker.lorem.word(),
      ciudad: faker.lorem.word(),
      aerolineas: [],
    });

    const aerolineaActualizada: AerolineaEntity =
      await servicio.associateAeropuertosAerolinea(aerolinea.id, [
        nuevoAeropuerto,
      ]);
    expect(aerolineaActualizada.aeropuertos.length).toBe(1);

    expect(aerolineaActualizada.aeropuertos[0].nombre).toBe(nuevoAeropuerto.nombre);
    expect(aerolineaActualizada.aeropuertos[0].ciudad).toBe(nuevoAeropuerto.ciudad);
    expect(aerolineaActualizada.aeropuertos[0].codigo).toBe(nuevoAeropuerto.codigo);
    expect(aerolineaActualizada.aeropuertos[0].pais).toBe(nuevoAeropuerto.pais);
  });

  it('asociarAeropuertosAerolinea debería arrojar excepcion de aerolinea gastronómica inválida.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.random.alpha(3),
      pais: faker.lorem.word(),
      ciudad: faker.lorem.word(),
      aerolineas: [],
    });

    await expect(() =>
      servicio.associateAeropuertosAerolinea('0', [nuevoAeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id especificado no fue encontrada',
    );
  });

  it('asociarAeropuertosAerolinea debería arrojar excepcion de aerolinea gastronómica inválida.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = listaAeropuertos[0];
    nuevoAeropuerto.id = '0';

    await expect(() =>
      servicio.associateAeropuertosAerolinea(aerolinea.id, [nuevoAeropuerto]),
    ).rejects.toHaveProperty('message', 'El aeropuerto con el id especificado no fue encontrado');
  });

  it('eliminarAeropuertoAerolinea debería remover una aeropuerto del restaurante.', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];

    await servicio.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id);

    const aerolineaAlmacenada: AerolineaEntity =
      await repositorioAerolinea.findOne({
        where: { id: aerolinea.id },
        relations: ['aeropuertos'],
      });
    const aeropuertoEliminada: AeropuertoEntity = aerolineaAlmacenada.aeropuertos.find(
      (a) => a.id === aeropuerto.id,
    );

    expect(aeropuertoEliminada).toBeUndefined();
  });

  it('eliminarAeropuertoAerolinea debería arrojar excepcion de aeropuerto inválida.', async () => {
    await expect(() =>
      servicio.deleteAeropuertoAerolinea(aerolinea.id, '0'),
    ).rejects.toHaveProperty('message', 'El aeropuerto con el id especificado no fue encontrado');
  });

  it('eliminarAeropuertoAerolinea  debería arrojar excepcion de aeropuerto inválida.', async () => {
    const aeropuerto: AeropuertoEntity = listaAeropuertos[0];
    await expect(() =>
      servicio.deleteAeropuertoAerolinea('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'La aerolinea con el id especificado no fue encontrada',
    );
  });

  it('eliminarAeropuertoAerolinea debería arrojar excepcion de aeropuerto no asociada a aerolinea gastronómica.', async () => {
    const nuevoAeropuerto: AeropuertoEntity = await repositorioAeropuerto.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.random.alpha(3),
      pais: faker.lorem.word(),
      ciudad: faker.lorem.word(),
      aerolineas: [],
    });

    await expect(() =>
      servicio.deleteAeropuertoAerolinea(aerolinea.id, nuevoAeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id dado no está asociada a la aerolinea',
    );
  });
});
