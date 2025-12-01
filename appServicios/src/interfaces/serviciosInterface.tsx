export interface VehiculoDto {
  id_vehiculo?: number;
  placas: string;
  marca: string;
  modelo: string;
  anio: number;
  propietario: string;
  activo?: boolean;
}

export interface ServicioDto {
  id_servicio?: number;
  id_vehiculo: number;
  tipo: string;
  fecha: string;
  costo: number;
  descripcion?: string;
}

export interface RevisionDto {
  id_revision?: number;
  id_servicio: number;
  fecha: string;
  inspector: string;
  kilometraje: number;
  resultados?: string;
  observaciones?: string;
}
