import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { Revision } from './revision.entity';

@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn({ name: 'id_servicio' })
  id_servicio: number;

  @Column({ name: 'id_vehiculo' })
  id_vehiculo: number;

  @Column({ type: 'varchar', length: 255 })
  tipo: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.servicios)
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo: Vehiculo;

  @OneToMany(() => Revision, (revision) => revision.servicio)
  revisiones: Revision[];
}
