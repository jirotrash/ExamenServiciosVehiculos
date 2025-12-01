import {
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsBoolean,
    IsInt,
    Min,
    Max,
    IsNotEmpty,
    IsAlphanumeric,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehiculoDto {
    @IsString()
    @IsAlphanumeric()
    @MinLength(6)
    @MaxLength(7)
    @IsNotEmpty()
    placas: string;

    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @IsNotEmpty()
    marca: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsNotEmpty()
    modelo: string;

    @Type(() => Number)
    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear())
    anio: number;

    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @IsNotEmpty()
    propietario: string;

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}