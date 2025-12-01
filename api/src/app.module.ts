import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiciosModule } from './servicios/servicios.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './servicios/entities/vehiculo.entity';
import { Servicio } from './servicios/entities/servicio.entity';
import { Revision } from './servicios/entities/revision.entity';

@Module({
      imports:[
        TypeOrmModule.forRoot({
          name: 'conexion-postgres',
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'chuchoivan',
          password: 'kfeputo123',
          database: 'serviciosdb',
          entities: [ Vehiculo, Servicio, Revision ],
          synchronize: true,
          autoLoadEntities: true,
        }),
        ServiciosModule,
      ],
      controllers: [AppController],
      providers: [AppService],
})
export class AppModule {}
