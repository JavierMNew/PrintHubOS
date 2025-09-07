import type { APIRoute } from 'astro';
import { db } from '../../db';
import { categorias } from '../../db/schema.js';

export const GET: APIRoute = async () => {
  try {
    const result = await db.select().from(categorias);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener categorías' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};