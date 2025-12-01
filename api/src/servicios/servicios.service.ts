import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Vehiculo } from './entities/vehiculo.entity';
import { Servicio } from './entities/servicio.entity';
import { Revision } from './entities/revision.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';

@Injectable()
export class ServiciosService {
    constructor(
        @InjectRepository(Vehiculo, "conexion-postgres")
        private readonly repoVehiculo: Repository<Vehiculo>,
        @InjectRepository(Servicio, "conexion-postgres")
        private readonly repoServicio: Repository<Servicio>,
        @InjectRepository(Revision, "conexion-postgres")
        private readonly repoRevision: Repository<Revision>,
    ) {}

    // VEHICULOS
    async createVehiculo(data: CreateVehiculoDto) {
        const vehiculo = this.repoVehiculo.create(data);
        return await this.repoVehiculo.save(vehiculo);
    }

    async findAllVehiculos(page: number = 1, limit: number = 10, baseUrl: string) {
        const [data, total] = await this.repoVehiculo
            .createQueryBuilder("v")
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("v.id_vehiculo", "ASC")
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        const next = (page < totalPages)
            ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}`
            : null;

        const prev = (page > 1)
            ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}`
            : null;

        return {
            total,
            totalPages,
            prev,
            next,
            page,
            limit,
            data,
        };
    }

    async findOneVehiculo(id_vehiculo: number) {
        const vehiculo = await this.repoVehiculo.findOne({
            where: { id_vehiculo },
            relations: ["servicios"]
        });
        if (!vehiculo) throw new NotFoundException("Vehículo no encontrado");
        return vehiculo;
    }

    async updateVehiculo(id_vehiculo: number, data: CreateVehiculoDto) {
        return await this.repoVehiculo.update(id_vehiculo, data);
    }

    async removeVehiculo(id_vehiculo: number) {
        return await this.repoVehiculo.delete(id_vehiculo);
    }

    // SERVICIOS
    async createServicio(data: CreateServicioDto) {
        const vehiculo = await this.findOneVehiculo(data.id_vehiculo);
        const servicio = this.repoServicio.create({
            ...data,
            vehiculo
        });
        return await this.repoServicio.save(servicio);
    }

    async findAllServicios(page: number = 1, limit: number = 10, baseUrl: string) {
        const [data, total] = await this.repoServicio
            .createQueryBuilder("s")
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("s.id_servicio", "ASC")
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        const next = (page < totalPages)
            ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}`
            : null;

        const prev = (page > 1)
            ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}`
            : null;

        return {
            total,
            totalPages,
            prev,
            next,
            page,
            limit,
            data,
        };
    }

    async findOneServicio(id_servicio: number) {
        const servicio = await this.repoServicio.findOne({
            where: { id_servicio },
            relations: ["vehiculo", "revisiones"]
        });
        if (!servicio) throw new NotFoundException("Servicio no encontrado");
        return servicio;
    }

    async updateServicio(id_servicio: number, data: CreateServicioDto) {
        return await this.repoServicio.update(id_servicio, data);
    }

    async removeServicio(id_servicio: number) {
        return await this.repoServicio.delete(id_servicio);
    }

    // REVISIONES
    async createRevision(data: CreateRevisionDto) {
        const servicio = await this.findOneServicio(data.id_servicio);
        const revision = this.repoRevision.create({
            ...data,
            servicio
        });
        return await this.repoRevision.save(revision);
    }

    async findAllRevisiones(page: number = 1, limit: number = 10, baseUrl: string) {
        const [data, total] = await this.repoRevision
            .createQueryBuilder("r")
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy("r.id_revision", "ASC")
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        const next = (page < totalPages)
            ? `${baseUrl}?page=${Number(page) + 1}&limit=${limit}`
            : null;

        const prev = (page > 1)
            ? `${baseUrl}?page=${Number(page) - 1}&limit=${limit}`
            : null;

        return {
            total,
            totalPages,
            prev,
            next,
            page,
            limit,
            data,
        };
    }

    async findOneRevision(id_revision: number) {
        const revision = await this.repoRevision.findOne({
            where: { id_revision },
            relations: ["servicio"]
        });
        if (!revision) throw new NotFoundException("Revisión no encontrada");
        return revision;
    }

    async updateRevision(id_revision: number, data: CreateRevisionDto) {
        return await this.repoRevision.update(id_revision, data);
    }

    async removeRevision(id_revision: number) {
        return await this.repoRevision.delete(id_revision);
    }


    async getCostoServiciosPorTipo(tipo: string) {
        if (!tipo || String(tipo).trim() === '') return { tipo: tipo || null, total: 0 };
        const tipoClean = String(tipo).trim();


        try {
            const override = await this.getPrecioPorTipo(tipoClean);
            if (override !== null && typeof override === 'number') {
                return { tipo: tipoClean, total: override };
            }
        } catch (err) {

        }


        const raw = await this.repoServicio
            .createQueryBuilder('s')
            .select('SUM(s.costo)', 'total')
            .where('LOWER(s.tipo) = LOWER(:tipo)', { tipo: tipoClean })
            .getRawOne();
        return { tipo: tipoClean, total: Number(raw?.total) || 0 };
    }


    private getPricesFilePath() {
        const dataDir = path.resolve(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        return path.join(dataDir, 'precios_por_tipo.json');
    }

    private async readPrices(): Promise<Record<string, number>> {
        const file = this.getPricesFilePath();
        try {
            if (!fs.existsSync(file)) {
                fs.writeFileSync(file, JSON.stringify({}), { encoding: 'utf8' });
                return {};
            }
            const raw = fs.readFileSync(file, { encoding: 'utf8' });
            return raw ? JSON.parse(raw) : {};
        } catch (err) {
            return {};
        }
    }

    private async writePrices(map: Record<string, number>) {
        const file = this.getPricesFilePath();
        fs.writeFileSync(file, JSON.stringify(map, null, 2), { encoding: 'utf8' });
    }

    async getPrecioPorTipo(tipo: string): Promise<number | null> {
        if (!tipo) return null;
        const map = await this.readPrices();
        const key = String(tipo).trim().toLowerCase();
        if (Object.prototype.hasOwnProperty.call(map, key)) return Number(map[key]);
        return null;
    }

    async setPrecioPorTipo(tipo: string, precio: number) {
        if (!tipo) throw new Error('tipo requerido');
        const map = await this.readPrices();
        const key = String(tipo).trim().toLowerCase();
        map[key] = Number(precio);
        await this.writePrices(map);
        return { tipo: tipo.trim(), precio: Number(precio) };
    }

    async removePrecioPorTipo(tipo: string) {
        if (!tipo) return false;
        const map = await this.readPrices();
        const key = String(tipo).trim().toLowerCase();
        if (Object.prototype.hasOwnProperty.call(map, key)) {
            delete map[key];
            await this.writePrices(map);
            return true;
        }
        return false;
    }

    async getVehiculosActivos(id_vehiculo?: number, activo?: boolean) {
        const qb = this.repoVehiculo.createQueryBuilder('v');
        if (typeof activo === 'boolean') qb.andWhere('v.activo = :activo', { activo });
        if (typeof id_vehiculo === 'number') qb.andWhere('v.id_vehiculo = :id_vehiculo', { id_vehiculo });
        return await qb.getMany();
    }

    async getServiciosPorVehiculo(id_vehiculo: number) {
        if (!id_vehiculo) return [];
        return await this.repoServicio
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.vehiculo', 'v')
            .leftJoinAndSelect('s.revisiones', 'r')
            .where('v.id_vehiculo = :id', { id: id_vehiculo })
            .getMany();
    }

    async getRevisionesPorVehiculo(id_vehiculo: number) {
        if (!id_vehiculo) return [];
        return await this.repoRevision
            .createQueryBuilder('r')
            .leftJoin('r.servicio', 's')
            .leftJoin('s.vehiculo', 'v')
            .where('v.id_vehiculo = :id', { id: id_vehiculo })
            .getMany();
    }

    async getListarVehiculosPorAnio(anio?: number) {
        if (!anio) return [];
        try {
            return await this.repoVehiculo
                .createQueryBuilder('v')
                .where('v.anio > :anio', { anio })
                .getMany();
        } catch (err) {
            return [];
        }
    }

    async getContarServiciosPorCosto(costo?: number) {
        if (!costo) return { costo: null, count: 0 };
        const count = await this.repoServicio
            .createQueryBuilder('s')
            .where('s.costo > :costo', { costo })
            .getCount();
        return { costo, count };
    }

    async getRevisionesPorResultado(resultado: string) {
        if (!resultado) return [];
        return await this.repoRevision
            .createQueryBuilder('r')
            .where('r.resultados = :resultado', { resultado })
            .getMany();
    }

    async getVehiculosConServicios(id_vehiculo?: number) {
        const qb = this.repoVehiculo.createQueryBuilder('v')
            .leftJoinAndSelect('v.servicios', 's');
        if (typeof id_vehiculo === 'number') qb.andWhere('v.id_vehiculo = :id', { id: id_vehiculo });
        return await qb.getMany();
    }
}
