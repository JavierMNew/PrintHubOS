import {
  int,
  mysqlTable,
  serial,
  varchar,
  text,
  decimal,
  date,
  timestamp,
  boolean,
  foreignKey,
} from "drizzle-orm/mysql-core";

export const categorias = mysqlTable("categorias", {
  idCategoria: serial("id_categoria").primaryKey(),
  nombre: varchar({ length: 100 }).notNull().unique(),
  descripcion: text(),
  activo: boolean().default(true),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion").defaultNow(),
});

export const proveedores = mysqlTable("proveedores", {
  idProveedor: serial("id_proveedor").primaryKey(),
  nombre: varchar({ length: 255 }).notNull(),
  razonSocial: varchar("razon_social", { length: 255 }),
  rfc: varchar({ length: 20 }),
  constanciaSituacionFiscal: varchar("constancia_situacion_fiscal", {
    length: 255,
  }),
  caratulaBancaria: varchar("caratula_bancaria", { length: 255 }),
  comprobanteDomicilio: varchar("comprobante_domicilio", { length: 255 }),
  verificacionEfo: boolean("verificacion_efo").default(false),
  contacto: varchar({ length: 100 }),
  telefono: varchar({ length: 20 }),
  email: varchar({ length: 100 }),
  direccion: text(),
  activo: boolean().default(true),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion").defaultNow(),
});

export const productos = mysqlTable(
  "productos",
  {
    idProducto: serial("id_producto").primaryKey(),
    sku: varchar({ length: 255 }),
    nombreArticulo: varchar("nombre_articulo", { length: 255 }).notNull(),
    descripcionArticulo: text("descripcion_articulo"),

    precioLote: decimal("precio_lote", { precision: 10, scale: 2 }).notNull(),
    cantidadLotes: int("cantidad_lotes").default(1),
    unidadesPorLote: int("unidades_por_lote").default(1),

    precioUnitarioSinIva: decimal("precio_unitario_sin_iva", {
      precision: 10,
      scale: 2,
    }),
    precioUnitarioConIva: decimal("precio_unitario_con_iva", {
      precision: 10,
      scale: 2,
    }),
    precioTotalSinIva: decimal("precio_total_sin_iva", {
      precision: 10,
      scale: 2,
    }),
    precioTotalConIva: decimal("precio_total_con_iva", {
      precision: 10,
      scale: 2,
    }),

    stockUnidades: int("stock_unidades").default(0),
    stockInicial: int("stock_inicial").default(0),

    porcentajeIva: decimal("porcentaje_iva", {
      precision: 5,
      scale: 2,
    }).default("16.00"),
    categoria: varchar({ length: 100 }),
    idCategoria: int("id_categoria"),
    fechaCompra: date("fecha_compra"),
    fechaRegistro: timestamp("fecha_registro").defaultNow(),
    fechaActualizacion: timestamp("fecha_actualizacion").defaultNow(),
    activo: boolean().default(true),
    idProveedor: int("id_proveedor"),
  },
  (table) => ({
    fkProductosProveedor: foreignKey({
      columns: [table.idProveedor],
      foreignColumns: [proveedores.idProveedor],
      name: "fk_productos_proveedor",
    })
      .onDelete("set null")
      .onUpdate("cascade"),

    fkProductosCategoria: foreignKey({
      columns: [table.idCategoria],
      foreignColumns: [categorias.idCategoria],
      name: "fk_productos_categoria",
    })
      .onDelete("set null")
      .onUpdate("cascade"),
  })
);
