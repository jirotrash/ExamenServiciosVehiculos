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

export class CreateRevisionDto {
    @IsNumber()
    @IsPositive()
    id_servicio: number;

    @IsDateString()
    fecha: string;

    @IsString()
    @MinLength(2)
    @MaxLength(255)
    inspector: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    kilometraje: number;

    @IsString()
    @IsOptional()
    resultados?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;
}