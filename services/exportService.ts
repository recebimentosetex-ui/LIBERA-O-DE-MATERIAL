
import { Release } from '../types';

declare const XLSX: any;

export const exportToExcel = (releases: Release[], fileName: string): void => {
  const worksheetData = releases.map(release => ({
    'MATERIAL': release.material,
    'OPERADOR': release.operador,
    'RUA': release.rua,
    'LOCAL DE ENTREGA': release.localDeEntrega,
    'DATA': release.data,
    'STATUS': release.status,
    'SM': release.sm,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Liberações');

  // Adjust column widths
  const cols = [
    { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 },
    { wch: 15 }, { wch: 30 }, { wch: 15 },
  ];
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
