import { useEffect, useState, useRef } from 'react';
import { serviciosApi } from '../api/serviciosApi';
import { VehiculoDto } from '../interfaces/serviciosInterface';

export const useServicios = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const fetchVehiculos = async (pageToFetch = 1, append = false) => {
    if (!append) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await serviciosApi.get('/vehiculos', { params: { page: pageToFetch, limit } });
      const raw = res.data?.data || res.data || [];
      const data = Array.isArray(raw)
        ? raw.map((v: any) => ({
            ...v,
            activo: ((): boolean => {
              if (v?.activo === undefined || v?.activo === null) return true;
              if (typeof v.activo === 'boolean') return v.activo;
              if (typeof v.activo === 'number') return v.activo !== 0;
              if (typeof v.activo === 'string') return v.activo.toLowerCase() === 'true' || v.activo === '1';
              return Boolean(v.activo);
            })(),
            anio: ((): number => {
              const a = v?.anio;
              if (typeof a === 'number') return a;
              if (typeof a === 'string') {
                const parsed = Number(a);
                return Number.isNaN(parsed) ? 0 : parsed;
              }
              return a ? Number(a) : 0;
            })()
          }))
        : [];

      if (!isMounted.current) return;

      if (append) {
        setVehiculos((prev) => [...prev, ...data]);
      } else {
        setVehiculos(data);
      }

      setHasMore(Array.isArray(data) ? data.length === limit : false);
      setPage(pageToFetch);
    } catch (e: any) {
      setError(e.message);
    } finally {
      if (!append) setLoading(false);
      else setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || loading || !hasMore) return;
    await fetchVehiculos(page + 1, true);
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchVehiculos(1, false);
  };

  const crearVehiculo = async (payload: VehiculoDto) => {
    const res = await serviciosApi.post('/vehiculos', payload);
    return res.data;
  };

  const updateVehiculo = async (id: number, payload: Partial<VehiculoDto>) => {
    const res = await serviciosApi.patch(`/vehiculos/${id}`, payload);
    return res.data;
  };

  const eliminarVehiculo = async (id: number) => {
    const res = await serviciosApi.delete(`/vehiculos/${id}`);
    return res.data;
  };

  useEffect(() => {
    fetchVehiculos(1, false);
  }, []);

  return { vehiculos, loading, error, fetchVehiculos, crearVehiculo, updateVehiculo, eliminarVehiculo, loadMore, loadingMore, refresh, refreshing, hasMore };
};
