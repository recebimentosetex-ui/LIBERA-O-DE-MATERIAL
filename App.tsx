
import React, { useState, useEffect } from 'react';
import { Release, Status } from './types';
import { exportToExcel } from './services/exportService';
import { ReleaseForm } from './components/ReleaseForm';
import { PlusIcon, EditIcon, DeleteIcon, ExportIcon, BackIcon } from './components/icons';

const App: React.FC = () => {
    const [releases, setReleases] = useState<Release[]>(() => {
        try {
            const savedReleases = localStorage.getItem('releases');
            return savedReleases ? JSON.parse(savedReleases) : [];
        } catch (error) {
            console.error("Could not parse releases from localStorage", error);
            return [];
        }
    });

    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingRelease, setEditingRelease] = useState<Release | null>(null);

    useEffect(() => {
        localStorage.setItem('releases', JSON.stringify(releases));
    }, [releases]);

    const handleAddClick = () => {
        setEditingRelease(null);
        setView('form');
    };

    const handleEditClick = (release: Release) => {
        setEditingRelease(release);
        setView('form');
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta liberação?')) {
            setReleases(releases.filter(r => r.id !== id));
        }
    };

    const handleFormSubmit = (releaseData: Omit<Release, 'id'> | Release) => {
        if ('id' in releaseData) {
            setReleases(releases.map(r => r.id === releaseData.id ? releaseData : r));
        } else {
            const newRelease: Release = {
                ...releaseData,
                id: Date.now(),
            };
            setReleases([newRelease, ...releases]);
        }
        setView('list');
    };

    const handleCancelForm = () => {
        setView('list');
        setEditingRelease(null);
    };

    const handleExport = () => {
        exportToExcel(releases, 'relatorio_liberacao_material');
    };
    
    const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
        const isPendente = status === Status.Pendente;
        const bgColor = isPendente ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-green-100 dark:bg-green-900';
        const textColor = isPendente ? 'text-yellow-800 dark:text-yellow-200' : 'text-green-800 dark:text-green-200';
        const label = isPendente ? 'Pendente' : 'Finalizado';
    
        return (
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
                {label}
            </span>
        );
    };
    
    const MainView: React.FC = () => (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LIBERAÇÃO DE MATERIAL</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie e acompanhe as liberações de materiais.</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button onClick={handleExport} disabled={releases.length === 0} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <ExportIcon className="mr-2 h-5 w-5" />
                        Exportar
                    </button>
                    <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        <PlusIcon className="mr-2 h-5 w-5" />
                        Adicionar
                    </button>
                </div>
            </header>
    
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {releases.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {['Material', 'Operador', 'Rua', 'Local', 'Data', 'Status', 'SM', 'Ações'].map(header => (
                                     <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        {header}
                                     </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {releases.map(release => (
                                <tr key={release.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{release.material}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.operador}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.rua}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.localDeEntrega}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(release.data + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <StatusBadge status={release.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.sm || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleEditClick(release)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" title="Editar">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => handleDeleteClick(release.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Excluir">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                        <div className="text-center py-16 px-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma liberação encontrada</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece adicionando uma nova liberação de material.</p>
                            <div className="mt-6">
                                <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                    Adicionar Liberação
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
    if (view === 'form') {
        return <ReleaseForm onSubmit={handleFormSubmit} onCancel={handleCancelForm} initialData={editingRelease} />;
    }
    
    return <MainView />;
};

export default App;
