import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import * as express from 'express';

@Controller('servicios')
export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) {}

    @Post('vehiculos')
    createVehiculo(@Body(new ValidationPipe()) data: CreateVehiculoDto) {
        return this.serviciosService.createVehiculo(data);
    }

    @Post('servicios')
    createServicio(@Body(new ValidationPipe()) data: CreateServicioDto) {
        return this.serviciosService.createServicio(data);
    }

    @Post('revisiones')
    createRevision(@Body(new ValidationPipe()) data: CreateRevisionDto) {
        return this.serviciosService.createRevision(data);
    }

    @Get('vehiculos')
    async findAllVehiculos(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: express.Request
    ) {
        const baseUrl = `${req.protocol}://${req.host}${req.baseUrl}/api/dsm44/servicios/vehiculos`;
        return this.serviciosService.findAllVehiculos(Number(page), Number(limit), baseUrl);
    }

    @Get('costo-por-tipo')
    getCostoServiciosPorTipo(@Query('tipo') tipo: string) {
        return this.serviciosService.getCostoServiciosPorTipo(tipo);
    }

    @Get('precios-por-tipo')
    getPrecioPorTipo(@Query('tipo') tipo: string) {
        return this.serviciosService.getPrecioPorTipo(tipo);
    }

    @Post('precios-por-tipo')
    setPrecioPorTipo(@Body(new ValidationPipe()) body: { tipo: string; precio: number }) {
        return this.serviciosService.setPrecioPorTipo(body.tipo, Number(body.precio));
    }

    @Delete('precios-por-tipo')
    removePrecioPorTipo(@Query('tipo') tipo: string) {
        return this.serviciosService.removePrecioPorTipo(tipo);
    }

    @Get('vehiculos/activos')
    async getVehiculosActivos(
        @Query('id_vehiculo') id_vehiculo?: string,
        @Query('estado') estado?: string,
    ) {
        // validate query params
        if (id_vehiculo !== undefined && id_vehiculo !== '' && isNaN(Number(id_vehiculo))) {
            throw new BadRequestException('id_vehiculo debe ser numérico');
        }
        if (estado !== undefined && estado !== 'true' && estado !== 'false') {
            throw new BadRequestException("estado debe ser 'true' o 'false'");
        }

        const id = id_vehiculo ? Number(id_vehiculo) : undefined;
        const activo = estado === undefined ? undefined : (estado === 'true');

        try {
            return await this.serviciosService.getVehiculosActivos(id, activo);
        } catch (err) {
            // Log server-side error and return Internal Server Error with message
            // eslint-disable-next-line no-console
            console.error('Error in getVehiculosActivos:', err);
            throw new InternalServerErrorException('Error al obtener vehículos activos');
        }
    }

    @Get('vehiculos/:id_vehiculo/servicios')
    getServiciosPorVehiculo(@Param('id_vehiculo') id_vehiculo: string) {
        return this.serviciosService.getServiciosPorVehiculo(Number(id_vehiculo));
    }

    @Get('vehiculos/:id_vehiculo/revisiones')
    getRevisionesPorVehiculo(@Param('id_vehiculo') id_vehiculo: string) {
        return this.serviciosService.getRevisionesPorVehiculo(Number(id_vehiculo));
    }

    @Get('vehiculos/por-anio')
    getListarVehiculosPorAnio(@Query('anio') anio?: string) {
        return this.serviciosService.getListarVehiculosPorAnio(anio ? Number(anio) : undefined);
    }

    @Get('servicios/contar-por-costo')
    getContarServiciosPorCosto(@Query('costo') costo?: string) {
        return this.serviciosService.getContarServiciosPorCosto(costo ? Number(costo) : undefined);
    }

    @Get('revisiones/por-resultado')
    getRevisionesPorResultado(@Query('resultado') resultado: string) {
        return this.serviciosService.getRevisionesPorResultado(resultado);
    }

    @Get('vehiculos/con-servicios')
    getVehiculosConServicios(@Query('id_vehiculo') id_vehiculo?: string) {
        return this.serviciosService.getVehiculosConServicios(id_vehiculo ? Number(id_vehiculo) : undefined);
    }

    @Get('vehiculos/:id_vehiculo')
    findOneVehiculo(@Param('id_vehiculo') id_vehiculo: number) {
        return this.serviciosService.findOneVehiculo(id_vehiculo);
    }

    @Patch('vehiculos/:id_vehiculo')
    updateVehiculo(@Param('id_vehiculo') id_vehiculo: number, @Body(new ValidationPipe()) data: CreateVehiculoDto) {
        return this.serviciosService.updateVehiculo(id_vehiculo, data);
    }

    @Delete('vehiculos/:id_vehiculo')
    removeVehiculo(@Param('id_vehiculo') id_vehiculo: number) {
        return this.serviciosService.removeVehiculo(id_vehiculo);
    }

    @Get('servicios')
    async findAllServicios(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: express.Request
    ) {
        const baseUrl = `${req.protocol}://${req.host}${req.baseUrl}/api/dsm44/servicios/servicios`;
        return this.serviciosService.findAllServicios(Number(page), Number(limit), baseUrl);
    }

    @Get('servicios/:id_servicio')
    findOneServicio(@Param('id_servicio') id_servicio: number) {
        return this.serviciosService.findOneServicio(id_servicio);
    }

    @Patch('servicios/:id_servicio')
    updateServicio(@Param('id_servicio') id_servicio: number, @Body(new ValidationPipe()) data: CreateServicioDto) {
        return this.serviciosService.updateServicio(id_servicio, data);
    }

    @Delete('servicios/:id_servicio')
    removeServicio(@Param('id_servicio') id_servicio: number) {
        return this.serviciosService.removeServicio(id_servicio);
    }

    @Get('revisiones')
    async findAllRevisiones(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: express.Request
    ) {
        const baseUrl = `${req.protocol}://${req.host}${req.baseUrl}/api/dsm44/servicios/revisiones`;
        return this.serviciosService.findAllRevisiones(Number(page), Number(limit), baseUrl);
    }

    @Get('revisiones/:id_revision')
    findOneRevision(@Param('id_revision') id_revision: number) {
        return this.serviciosService.findOneRevision(id_revision);
    }

    //------------------------------------------------------------------------------------------------------------
    @Patch('revisiones/:id_revision')
    updateRevision(@Param('id_revision') id_revision: number, @Body(new ValidationPipe()) data: CreateRevisionDto) {
        return this.serviciosService.updateRevision(id_revision, data);
    }

    @Delete('revisiones/:id_revision')
    removeRevision(@Param('id_revision') id_revision: number) {
        return this.serviciosService.removeRevision(id_revision);
    }
}
    