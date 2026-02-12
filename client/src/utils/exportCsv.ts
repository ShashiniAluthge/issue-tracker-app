// exportCsv.ts
export const exportToCSV = (data: any[], fileName: string, headers?: string[]) => {
    if (!data || data.length === 0) return;

    const csvHeaders = headers || Object.keys(data[0]);
    const rows = data.map(row =>
        csvHeaders.map(header => {
            const value = row[header as keyof typeof row];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
    );

    const csvContent = [csvHeaders.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
