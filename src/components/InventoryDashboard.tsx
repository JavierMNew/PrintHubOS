import React, { useState } from 'react';
import InventoryTable from './InventoryTable';

type TableType = 'categorias' | 'proveedores' | 'productos';

export default function InventoryDashboard() {
  const [activeTable, setActiveTable] = useState<TableType>('productos');

  const tabs = [
    { id: 'productos' as TableType, label: 'Productos', icon: '📦' },
    { id: 'categorias' as TableType, label: 'Categorías', icon: '📂' },
    { id: 'proveedores' as TableType, label: 'Proveedores', icon: '🏢' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Inventarios
          </h1>
          <p className="text-gray-600">
            Gestiona tus productos, categorías y proveedores
          </p>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTable(tab.id)}
                className={`${
                  activeTable === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de la tabla activa */}
        <InventoryTable tableType={activeTable} />
      </div>
    </div>
  );
}