import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
// eslint-disable-next-line prettier/prettier
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AeropuertoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToMany(() => AerolineaEntity, (aerolinea) => aerolinea.aeropuertos)
  @JoinTable()
  aerolineas: AerolineaEntity[];
}
