import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Crear la conexión
const connection = await mysql.createConnection(process.env.DATABASE_URL!);

// Crear la instancia de Drizzle
export const db = drizzle(connection);

// Función para ejecutar consultas SQL directas si las necesitas
export async function executeQuery(query: string, params?: any[]) {
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}