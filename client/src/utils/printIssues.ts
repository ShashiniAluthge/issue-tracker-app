import { type Issue } from '../types/issue.types';

export const printIssues = (
    issues: Issue[],
    filters?: {
        search?: string;
        status?: string;
        priority?: string;
    }
) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        alert('Please allow popups to print');
        return;
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        const colors = {
            open: '#FEF3C7',
            'in-progress': '#E9D5FF',
            resolved: '#D1FAE5',
            closed: '#F3F4F6',
        };
        return colors[status as keyof typeof colors] || '#F3F4F6';
    };

    // Get priority badge color
    const getPriorityColor = (priority: string) => {
        const colors = {
            low: '#DBEAFE',
            medium: '#FEF3C7',
            high: '#FED7AA',
            critical: '#FEE2E2',
        };
        return colors[priority as keyof typeof colors] || '#FEF3C7';
    };

    // Build filter info
    let filterInfo = '';
    if (filters?.search || filters?.status || filters?.priority) {
        const activeFilters = [];
        if (filters.search) activeFilters.push(`Search: "${filters.search}"`);
        if (filters.status) activeFilters.push(`Status: ${filters.status}`);
        if (filters.priority) activeFilters.push(`Priority: ${filters.priority}`);
        filterInfo = `
            <div style="background-color: #F3F4F6; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #4B5563;">
                    <strong>Active Filters:</strong> ${activeFilters.join(' | ')}
                </p>
            </div>
        `;
    }

    // Build table rows
    const tableRows = issues
        .map(
            (issue, index) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 12px 8px; font-size: 14px;">${index + 1}</td>
            <td style="padding: 12px 8px;">
                <div style="font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 4px;">
                    ${issue.title}
                </div>
                <div style="font-size: 12px; color: #6B7280; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${issue.description}
                </div>
            </td>
            <td style="padding: 12px 8px;">
                <span style="background-color: ${getStatusColor(issue.status)}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-block;">
                    ${issue.status}
                </span>
            </td>
            <td style="padding: 12px 8px;">
                <span style="background-color: ${getPriorityColor(issue.priority)}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-block;">
                    ${issue.priority}
                </span>
            </td>
            <td style="padding: 12px 8px; font-size: 13px; color: #4B5563;">
                <div>${issue.user_name}</div>
                <div style="font-size: 11px; color: #9CA3AF;">${issue.user_email}</div>
            </td>
            <td style="padding: 12px 8px; font-size: 13px; color: #4B5563;">
                ${formatDate(issue.created_at)}
            </td>
        </tr>
    `
        )
        .join('');

    // HTML content for printing
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Issues Report - ${new Date().toLocaleDateString()}</title>
            <style>
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none; }
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    padding: 40px;
                    color: #1F2937;
                    background: white;
                }
                
                .header {
                    border-bottom: 3px solid #1E40AF;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                
                .header h1 {
                    font-size: 32px;
                    color: #1E40AF;
                    margin-bottom: 8px;
                }
                
                .header .meta {
                    font-size: 14px;
                    color: #6B7280;
                }
                
                .summary {
                    background-color: #EFF6FF;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    border-left: 4px solid #1E40AF;
                }
                
                .summary h2 {
                    font-size: 18px;
                    color: #1E40AF;
                    margin-bottom: 8px;
                }
                
                .summary p {
                    font-size: 14px;
                    color: #4B5563;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                thead {
                    background-color: #F9FAFB;
                }
                
                thead th {
                    padding: 12px 8px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 600;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 2px solid #E5E7EB;
                }
                
                tbody tr:last-child {
                    border-bottom: none;
                }
                
                tbody tr:hover {
                    background-color: #F9FAFB;
                }
                
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #E5E7EB;
                    text-align: center;
                    font-size: 12px;
                    color: #9CA3AF;
                }
                
                .print-button {
                    background-color: #1E40AF;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 20px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .print-button:hover {
                    background-color: #1E3A8A;
                }
                
                .print-icon {
                    width: 20px;
                    height: 20px;
                }
            </style>
        </head>
        <body>
            <!-- Print Button (hidden when printing) -->
            <div class="no-print" style="text-align: center;">
                <button class="print-button" onclick="window.print()">
                    <svg class="print-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                    </svg>
                    Print This Report
                </button>
            </div>
            
            <!-- Header -->
            <div class="header">
                <h1>Issues Report</h1>
                <div class="meta">
                    Generated on ${new Date().toLocaleString()} | Total Issues: ${issues.length}
                </div>
            </div>
            
            <!-- Active Filters -->
            ${filterInfo}
            
            <!-- Summary -->
            <div class="summary">
                <h2>Report Summary</h2>
                <p>This report contains ${issues.length} issue${issues.length !== 1 ? 's' : ''} from the Issue Tracker system.</p>
            </div>
            
            <!-- Issues Table -->
            <table>
                <thead>
                    <tr>
                        <th style="width: 40px;">#</th>
                        <th style="width: 35%;">Issue</th>
                        <th style="width: 12%;">Status</th>
                        <th style="width: 12%;">Priority</th>
                        <th style="width: 18%;">Created By</th>
                        <th style="width: 18%;">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            
            <!-- Footer -->
            <div class="footer">
                <p>Issue Tracker System | Confidential Report</p>
                <p>Page printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <script>
                // Auto-focus print dialog (optional)
                // window.onload = () => window.print();
            </script>
        </body>
        </html>
    `;

    // Write content and close document
    printWindow.document.write(htmlContent);
    printWindow.document.close();


};