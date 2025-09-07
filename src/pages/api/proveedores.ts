import type { APIRoute } from 'astro';
import { db } from '../../db/index.js';
import { proveedores } from '../../db/schema.js';

export const GET: APIRoute = async () => {
  try {
    const result = await db.select().from(proveedores);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching proveedores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener proveedores' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};