
import React, { useState, useEffect } from 'react';
import { Release, Status } from '../types';
import { OPERADORES, RUAS, LOCAIS_DE_ENTREGA, STATUS_OPTIONS } from '../constants';

interface ReleaseFormProps {
  onSubmit: (release: Omit<Release, 'id'> | Release) => void;
  onCancel: () => void;
  initialData?: Release | null;
}

interface FormErrors {
  [key: string]: string;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; required?: boolean }> = ({ label, id, value, onChange, error, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={id === 'data' ? 'date' : 'text'}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: (string | { value: string; label: string })[]; error?: string; required?: boolean }> = ({ label, id, value, onChange, options, error, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100"
        >
            <option value="">Selecione...</option>
            {options.map(opt => {
                const val = typeof opt === 'string' ? opt : opt.value;
                const lab = typeof opt === 'string' ? opt : opt.label;
                return <option key={val} value={val}>{lab}</option>;
            })}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);


export const ReleaseForm: React.FC<ReleaseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<Release, 'id'>>({
    material: '',
    operador: '',
    rua: '',
    localDeEntrega: '',
    data: new Date().toISOString().split('T')[0],
    status: Status.Pendente,
    sm: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(errors[name]) {
        setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.material.trim()) newErrors.material = 'Material é obrigatório.';
    if (!formData.operador) newErrors.operador = 'Operador é obrigatório.';
    if (!formData.rua) newErrors.rua = 'Rua é obrigatória.';
    if (!formData.localDeEntrega) newErrors.localDeEntrega = 'Local de Entrega é obrigatório.';
    if (!formData.data) newErrors.data = 'Data é obrigatória.';
    if (!formData.status) newErrors.status = 'Status é obrigatório.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (initialData) {
        onSubmit({ ...formData, id: initialData.id });
      } else {
        onSubmit(formData);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                {initialData ? 'Editar Liberação' : 'Nova Liberação de Material'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Material" id="material" value={formData.material} onChange={handleChange} error={errors.material} />
                    <SelectField label="Operador" id="operador" value={formData.operador} onChange={handleChange} options={OPERADORES} error={errors.operador} />
                    <SelectField label="Rua" id="rua" value={formData.rua} onChange={handleChange} options={RUAS} error={errors.rua} />
                    <SelectField label="Local de Entrega" id="localDeEntrega" value={formData.localDeEntrega} onChange={handleChange} options={LOCAIS_DE_ENTREGA} error={errors.localDeEntrega} />
                    <InputField label="Data" id="data" value={formData.data} onChange={handleChange} error={errors.data} />
                    <SelectField label="Status" id="status" value={formData.status} onChange={handleChange} options={STATUS_OPTIONS} error={errors.status} />
                    <div className="md:col-span-2">
                        <InputField label="SM" id="sm" value={formData.sm} onChange={handleChange} error={errors.sm} required={false} />
                    </div>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        {initialData ? 'Salvar Alterações' : 'Adicionar Liberação'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
