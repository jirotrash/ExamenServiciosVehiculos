import {
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsPositive,
    IsNumber,
    IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServicioDto {
    @IsNumber()
    @IsPositive()
    id_vehiculo: number;

    @IsString()
    @MinLength(2)
    @MaxLength(255)
    tipo: string;

    @IsDateString()
    fecha: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    costo: number;

    @IsString()
    @IsOptional()
    descripcion?: string;
}
