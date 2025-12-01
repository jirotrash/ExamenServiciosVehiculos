import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Servicio } from './servicio.entity';

@Entity('revisiones')
export class Revision {
  @PrimaryGeneratedColumn({ name: 'id_revision' })
  id_revision: number;

  @Column({ name: 'id_servicio' })
  id_servicio: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 255 })
  inspector: string;

  @Column({ type: 'int' })
  kilometraje: number;

  @Column({ type: 'text', nullable: true })
  resultados: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Servicio, (servicio) => servicio.revisiones)
  @JoinColumn({ name: 'id_servicio' })
  servicio: Servicio;
}
