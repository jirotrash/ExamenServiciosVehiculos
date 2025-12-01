import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { Servicio } from './entities/servicio.entity';
import { Revision } from './entities/revision.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Vehiculo,
            Servicio,
            Revision
        ],"conexion-postgres")
    ],
    controllers: [ServiciosController],
    providers: [ServiciosService],
})
export class ServiciosModule {}
