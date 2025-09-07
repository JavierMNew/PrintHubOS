import type { APIRoute } from 'astro';
import { db } from '../../db/index.js';
import { productos, categorias, proveedores } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    // Consultamos productos con información de categorías y proveedores
    const result = await db
      .select({
        idProducto: productos.idProducto,
        sku: productos.sku,
        nombreArticulo: productos.nombreArticulo,
        descripcionArticulo: productos.descripcionArticulo,
        precioLote: productos.precioLote,
        cantidadLotes: productos.cantidadLotes,
        unidadesPorLote: productos.unidadesPorLote,
        precioUnitarioConIva: productos.precioUnitarioConIva,
        stockUnidades: productos.stockUnidades,
        fechaCompra: productos.fechaCompra,
        activo: productos.activo,
        categoria: categorias.nombre,
        proveedor: proveedores.nombre,
      })
      .from(productos)
      .leftJoin(categorias, eq(productos.idCategoria, categorias.idCategoria))
      .leftJoin(proveedores, eq(productos.idProveedor, proveedores.idProveedor));
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching productos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener productos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};