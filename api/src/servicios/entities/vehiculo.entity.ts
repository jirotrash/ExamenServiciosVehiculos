import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Servicio } from './servicio.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn({ name: 'id_vehiculo' })
  id_vehiculo: number;

  @Column({ type: 'varchar', length: 7, unique: true })
  placas: string;

  @Column({ type: 'varchar', length: 255 })
  marca: string;

  @Column({ type: 'varchar', length: 255 })
  modelo: string;

  @Column({ type: 'int', name: 'anio' })
  anio: number;

  @Column({ type: 'varchar', length: 255 })
  propietario: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Servicio, (servicio) => servicio.vehiculo)
  servicios: Servicio[];
}
