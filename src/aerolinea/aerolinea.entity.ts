import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AerolineaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  fechaDeFundacion: string;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => AeropuertoEntity, {
    cascade: true,
  })
  @JoinTable()
  aeropuertos: AeropuertoEntity[];
}
