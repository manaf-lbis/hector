"use client";

import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    alpha,
    Avatar,
    IconButton,
    Tooltip,
    Stack
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
    Category as CategoryIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ClockIcon
} from '@mui/icons-material';
import { 
    useGetCategoriesQuery, 
    useCreateCategoryMutation, 
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation,
    useBulkUpdateCategoryStatusMutation,
    useBulkDeleteCategoriesMutation
} from '@/store/api/category.api';
import AdminPageHeader from '@/components/ui/admin/AdminPageHeader';
import AdminTable, { AdminTableColumn } from '@/components/ui/admin/AdminTable';
import BulkActionBanner, { BulkAction } from '@/components/ui/admin/BulkActionBanner';
import { Chip } from '@mui/material';
import AppButton from '@/components/ui/AppButton';
import CategoryModal from '@/components/features/admin/categories/CategoryModal';
import { toast } from 'react-hot-toast';

export default function AdminCategoriesPage() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { data: categories = [], isLoading } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [bulkUpdateStatus] = useBulkUpdateCategoryStatusMutation();
    const [bulkDelete] = useBulkDeleteCategoriesMutation();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleAddClick = () => {
        router.push('/admin/categories/add');
    };

    const handleEditClick = (category: any) => {
        router.push(`/admin/categories/edit/${category._id}`);
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted successfully');
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleBulkStatus = async (status: 'active' | 'blocked') => {
        try {
            await bulkUpdateStatus({ ids: selectedIds, status }).unwrap();
            setSelectedIds([]);
            toast.success(`Selected categories ${status} successfully`);
        } catch (error) {
            toast.error(`Failed to ${status} categories`);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) {
            try {
                await bulkDelete({ ids: selectedIds }).unwrap();
                setSelectedIds([]);
                toast.success('Selected categories deleted successfully');
            } catch (error) {
                toast.error('Failed to delete selected categories');
            }
        }
    };

    const bulkActions: BulkAction[] = [
        { 
            label: 'Block Selected', 
            onClick: () => handleBulkStatus('blocked'), 
            color: 'error',
            icon: <BlockIcon fontSize="small" />
        },
        { 
            label: 'Delete Selected', 
            onClick: handleBulkDelete, 
            color: 'error',
            variant: 'outlined',
            icon: <DeleteIcon fontSize="small" />
        }
    ];


    const columns: AdminTableColumn[] = [
        {
            id: 'category',
            label: 'Category',
            render: (cat: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={cat.image}
                        sx={{
                            width: 40, height: 40,
                            bgcolor: alpha('#1B8A5A', 0.1),
                            color: '#1B8A5A',
                            fontWeight: 700,
                            borderRadius: '12px'
                        }}
                    >
                        {cat.name[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {cat.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {cat.description || 'No description provided'}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'status',
            label: 'Status',
            align: 'center',
            render: (cat: any) => (
                <Chip
                    icon={cat.status === 'blocked' ? <BlockIcon sx={{ fontSize: '14px !important' }} /> : <ClockIcon sx={{ fontSize: '14px !important' }} />}
                    label={(cat.status || 'active').toUpperCase()}
                    size="small"
                    color={cat.status === 'blocked' ? 'error' : 'success'}
                    variant={cat.status === 'blocked' ? 'outlined' : 'filled'}
                    sx={{
                        fontWeight: 700,
                        borderRadius: '16px',
                        px: 1,
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': { ml: 0.5 }
                    }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            render: (cat: any) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(cat)} sx={{ color: 'primary.main', bgcolor: alpha('#1565c0', 0.05) }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(cat._id)} sx={{ color: 'error.main', bgcolor: alpha('#d32f2f', 0.05) }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
            <AdminPageHeader 
                title="Category Management"
                subtitle="Organize your platform by managing auction categories."
                stats={[
                    { label: 'Total Categories', value: categories.length, icon: CategoryIcon, color: '#1B8A5A' }
                ]}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <AppButton 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                    sx={{ px: 4, borderRadius: '12px' }}
                >
                    Add Category
                </AppButton>
            </Box>

            <AdminTable
                columns={columns}
                data={categories}
                totalCount={categories.length}
                isLoading={isLoading}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, p) => setPage(p)}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />

            <BulkActionBanner
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
                actions={bulkActions}
            />

        </Container>
    );
}
