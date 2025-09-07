import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

// Tipos para nuestras tablas
type Categoria = {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
};

type Proveedor = {
  idProveedor: number;
  nombre: string;
  razonSocial: string | null;
  rfc: string | null;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  activo: boolean;
};

type Producto = {
  idProducto: number;
  sku: string | null;
  nombreArticulo: string;
  descripcionArticulo: string | null;
  precioLote: string;
  cantidadLotes: number;
  unidadesPorLote: number;
  precioUnitarioConIva: string | null;
  stockUnidades: number;
  fechaCompra: string | null;
  activo: boolean;
  categoria: string | null;
  proveedor: string | null;
};

const columnHelper = createColumnHelper<any>();

// Configuración de columnas para cada tabla
const categoriasColumns = [
  /*columnHelper.accessor('idCategoria', {
    header: 'ID',
    cell: info => info.getValue(),
  }),*/
  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('descripcion', {
    header: 'Descripción',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('activo', {
    header: 'Activo',
    cell: info => (
      <span className={`px-2 py-1 rounded text-xs ${
        info.getValue() 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {info.getValue() ? 'Sí' : 'No'}
      </span>
    ),
  }),
  columnHelper.accessor('fechaCreacion', {
    header: 'Fecha Creación',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const proveedoresColumns = [
  /*columnHelper.accessor('idProveedor', {
    header: 'ID',
    cell: info => info.getValue(),
  }),*/
  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('razonSocial', {
    header: 'Razón Social',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('rfc', {
    header: 'RFC',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('contacto', {
    header: 'Contacto',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('telefono', {
    header: 'Teléfono',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('activo', {
    header: 'Activo',
    cell: info => (
      <span className={`px-2 py-1 rounded text-xs ${
        info.getValue() 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {info.getValue() ? 'Sí' : 'No'}
      </span>
    ),
  }),
];

const productosColumns = [
  /*columnHelper.accessor('idProducto', {
    header: 'ID',
    cell: info => info.getValue(),
  }),*/
  columnHelper.accessor('sku', {
    header: 'SKU',
    cell: info => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('nombreArticulo', {
    header: 'Artículo',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('categoria', {
    header: 'Categoría',
    cell: info => info.getValue() || 'Sin categoría',
  }),
  columnHelper.accessor('proveedor', {
    header: 'Proveedor',
    cell: info => info.getValue() || 'Sin proveedor',
  }),
  columnHelper.accessor('precioLote', {
    header: 'Precio Lote',
    cell: info => `$${parseFloat(info.getValue()).toFixed(2)}`,
  }),
  columnHelper.accessor('cantidadLotes', {
    header: 'Lotes',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('stockUnidades', {
    header: 'Stock',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('activo', {
    header: 'Activo',
    cell: info => (
      <span className={`px-2 py-1 rounded text-xs ${
        info.getValue() 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {info.getValue() ? 'Sí' : 'No'}
      </span>
    ),
  }),
];

interface InventoryTableProps {
  tableType: 'categorias' | 'proveedores' | 'productos';
}

export default function InventoryTable({ tableType }: InventoryTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Seleccionar columnas según el tipo de tabla
  const columns = React.useMemo(() => {
    switch (tableType) {
      case 'categorias':
        return categoriasColumns;
      case 'proveedores':
        return proveedoresColumns;
      case 'productos':
        return productosColumns;
      default:
        return [];
    }
  }, [tableType]);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${tableType}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableType]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const tableTitle = {
    categorias: 'Categorías',
    proveedores: 'Proveedores',
    productos: 'Productos'
  }[tableType];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{tableTitle}</h2>
        
        {/* Buscador global */}
        <div className="mb-4">
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
            placeholder={`Buscar en ${tableTitle.toLowerCase()}...`}
          />
          <button className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">Agregar {tableTitle}</button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
        
        <span className="text-sm text-gray-700">
          Página{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </strong>{' '}
        </span>
        
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="px-3 py-1 border border-gray-300 rounded-md"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Mostrando {table.getRowModel().rows.length} de {data.length} registros
      </div>
    </div>
  );
}