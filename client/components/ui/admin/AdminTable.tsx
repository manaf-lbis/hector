import React from 'react';
import { 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    TablePagination, 
    CircularProgress, 
    alpha,
    Card,
    CardContent,
    useMediaQuery,
    useTheme,
    Checkbox
} from '@mui/material';

export interface AdminTableColumn {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string | number;
    render?: (row: any) => React.ReactNode;
}

interface AdminTableProps {
    columns: AdminTableColumn[];
    data: any[];
    isLoading?: boolean;
    totalCount?: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRowClick?: (row: any) => void;
    renderMobileCard?: (row: any) => React.ReactNode;
    showCheckboxes?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
    columns,
    data,
    isLoading,
    totalCount = 0,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onRowClick,
    renderMobileCard,
    showCheckboxes = true,
    selectedIds = [],
    onSelectionChange
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isMobile && renderMobileCard) {
        return (
            <Box>
                {data.map((row, index) => (
                    <Card key={row._id || index} sx={{ mb: 2, borderRadius: 3, cursor: onRowClick ? 'pointer' : 'default' }} onClick={() => onRowClick?.(row)}>
                        <CardContent>
                            {renderMobileCard(row)}
                        </CardContent>
                    </Card>
                ))}
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Box>
        );
    }

    return (
        <Paper 
            sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.text.primary, 0.02)}`
            }}
        >
            <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {showCheckboxes && (
                                <TableCell padding="checkbox" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), py: 2.5 }}>
                                    <Checkbox 
                                        size="small" 
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                        checked={data.length > 0 && selectedIds.length === data.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onSelectionChange?.(data.map(row => row._id));
                                            } else {
                                                onSelectionChange?.([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell 
                                    key={column.id} 
                                    align={column.align}
                                    sx={{ 
                                        width: column.width,
                                        fontWeight: 800,
                                        py: 2.5,
                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                        color: 'text.secondary',
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow 
                                key={row._id || index} 
                                hover 
                                onClick={() => onRowClick?.(row)}
                                sx={{ 
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.01)
                                    },
                                    '&:last-child td, &:last-child th': { border: 0 }
                                }}
                            >
                                {showCheckboxes && (
                                    <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
                                        <Checkbox 
                                            size="small" 
                                            checked={selectedIds.includes(row._id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                const newSelected = e.target.checked
                                                    ? [...selectedIds, row._id]
                                                    : selectedIds.filter(id => id !== row._id);
                                                onSelectionChange?.(newSelected);
                                            }}
                                            onClick={(e) => e.stopPropagation()} 
                                        />
                                    </TableCell>
                                )}
                                {columns.map((column) => (
                                    <TableCell 
                                        key={column.id} 
                                        align={column.align} 
                                        sx={{ 
                                            py: 2.5, 
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {column.render ? column.render(row) : row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                sx={{
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    '.MuiTablePagination-toolbar': { minHeight: 60 }
                }}
            />
        </Paper>
    );
};

export default AdminTable;
