"use client";

import React, { useState } from 'react';
import {
    Container,
    Box,
    Chip,
    Typography,
    alpha,
    Avatar,
    Button,
    Grid,
    Stack,
    IconButton
} from '@mui/material';
import {
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    Block as BlockIcon,
    PendingActions as PendingActionsIcon,
    Visibility as VisibilityIcon,
    Schedule as ClockIcon
} from '@mui/icons-material';
import { 
    useGetAllUsersQuery, 
    useBulkUpdateUserStatusMutation 
} from '@/store/api/userAdmin.api';
import AdminPageHeader from '@/components/ui/admin/AdminPageHeader';
import AdminStatsCard from '@/components/ui/admin/AdminStatsCard';
import AdminTable, { AdminTableColumn } from '@/components/ui/admin/AdminTable';
import AdminSearch from '@/components/ui/admin/AdminSearch';
import AdminFilter from '@/components/ui/admin/AdminFilter';
import BulkActionBanner, { BulkAction } from '@/components/ui/admin/BulkActionBanner';
import AppButton from '@/components/ui/AppButton';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminUsersPage() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [bulkUpdateStatus] = useBulkUpdateUserStatusMutation();

    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data: result, isLoading } = useGetAllUsersQuery({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
        status: selectedStatus
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (user: any) => {
        router.push(`/admin/users/${user._id}`);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setPage(0);
    };

    const showClear = searchTerm !== '' || selectedStatus !== 'all';

    const filteredUsers = result?.users || [];

    const columns: AdminTableColumn[] = [
        {
            id: 'user',
            label: 'Account Details',
            render: (user: any) => {
                const profilePic = user.kyc?.profilePicture || user.kycData?.profilePicture;
                const picUrl = profilePic ? `${process.env.NEXT_PUBLIC_API_URI || 'http://localhost:3001/api'}/kyc/files/${profilePic}` : undefined;
                
                return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={picUrl}
                        sx={{
                            width: 40, height: 40,
                            borderRadius: '12px',
                            bgcolor: alpha('#1B8A5A', 0.1),
                            color: '#1B8A5A',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            border: `1.5px solid ${alpha('#1B8A5A', profilePic ? 0.3 : 0.1)}`
                        }}
                    >
                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)}
                    </Avatar>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                {user.name}
                            </Typography>
                            {user.customId && (
                                <Chip
                                    label={`ID: ${user.customId}`}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        bgcolor: '#DBF3AC',
                                        color: '#1B8A5A',
                                        borderRadius: '4px'
                                    }}
                                />
                            )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                            {user.email} • Ref: {user._id.substring(0, 8)}
                        </Typography>
                        {user.lastLogin && (
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <ClockIcon sx={{ fontSize: '12px' }} />
                                LAST LOGIN: {new Date(user.lastLogin).toLocaleDateString()} at {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        )}
                    </Box>
                </Box>
                );
            }
        },
        {
            id: 'status',
            label: 'Status',
            align: 'center',
            render: (user: any) => (
                <Chip
                    icon={<ClockIcon sx={{ fontSize: '14px !important' }} />}
                    label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    size="small"
                    color={user.status === 'active' ? 'success' : 'error'}
                    variant={user.status === 'active' ? 'filled' : 'outlined'}
                    sx={{
                        fontWeight: 700,
                        borderRadius: '16px',
                        px: 1,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': { ml: 0.5 }
                    }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            render: (user: any) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); handleRowClick(user); }}
                        sx={{ 
                            color: 'primary.main', 
                            bgcolor: alpha('#1B8A5A', 0.05),
                            '&:hover': { bgcolor: alpha('#1B8A5A', 0.1) }
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                        size="small"
                        onClick={async (e) => { 
                            e.stopPropagation(); 
                            try {
                                await bulkUpdateStatus({ 
                                    userIds: [user._id], 
                                    status: user.status === 'blocked' ? 'active' : 'blocked' 
                                }).unwrap();
                            } catch (error) {
                                console.error('Status update failed:', error);
                            }
                        }}
                        sx={{ 
                            color: user.status === 'blocked' ? 'success.main' : 'error.main',
                            bgcolor: user.status === 'blocked' ? alpha('#1B8A5A', 0.1) : alpha('#EF4444', 0.05),
                            '&:hover': { bgcolor: user.status === 'blocked' ? alpha('#1B8A5A', 0.2) : alpha('#EF4444', 0.1) }
                        }}
                    >
                        {user.status === 'blocked' ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                    </IconButton>
                </Stack>
            )
        }
    ];

    const stats = [
        { label: 'Total Users', value: result?.counts?.all || 0, icon: PeopleIcon, color: '#1B8A5A' },
        { label: 'Active', value: result?.counts?.active || 0, icon: CheckCircleIcon, color: '#1B8A5A' },
        { label: 'Pending', value: result?.counts?.pending || 0, icon: ClockIcon, color: '#F59E0B' },
        { label: 'Blocked', value: result?.counts?.blocked || 0, icon: BlockIcon, color: '#EF4444' }
    ];

    const filterOptions = [
        { label: 'All Users', value: 'all', count: result?.counts?.all },
        { label: 'Active', value: 'active', count: result?.counts?.active },
        { label: 'Pending', value: 'pending', count: result?.counts?.pending },
        { label: 'Blocked', value: 'blocked', count: result?.counts?.blocked }
    ];

    const handleBulkStatus = async (status: 'active' | 'blocked') => {
        try {
            await bulkUpdateStatus({ userIds: selectedIds, status }).unwrap();
            setSelectedIds([]);
        } catch (error) {
            console.error('Bulk update failed:', error);
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
            label: 'Unblock Selected', 
            onClick: () => handleBulkStatus('active'), 
            color: 'success',
            variant: 'outlined',
            icon: <CheckCircleIcon fontSize="small" />
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
            <AdminPageHeader 
                title="User Directory"
                subtitle={`Manage platform access and review ${result?.total || 0} user profiles.`}
                stats={stats}
            />


            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
                sx={{ mb: 4 }}
            >
                <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <AdminSearch
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search users by Name, Email, or ID..."
                    />
                    <AdminFilter
                        options={filterOptions}
                        activeValue={selectedStatus}
                        onSelect={setSelectedStatus}
                        onClear={handleClearFilters}
                        showClear={showClear}
                    />
                </Box>

            </Stack>

            <AdminTable
                columns={columns}
                data={filteredUsers}
                totalCount={result?.total || 0}
                isLoading={isLoading}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onRowClick={handleRowClick}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                renderMobileCard={(user) => {
                    const profilePic = user.kyc?.profilePicture || user.kycData?.profilePicture;
                    const picUrl = profilePic ? `${process.env.NEXT_PUBLIC_API_URI || 'http://localhost:3001/api'}/kyc/files/${profilePic}` : undefined;
                    
                    return (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Avatar 
                                src={picUrl}
                                sx={{ 
                                    width: 40, height: 40,
                                    borderRadius: '10px',
                                    bgcolor: alpha('#1B8A5A', 0.1), 
                                    color: '#1B8A5A',
                                    fontWeight: 700,
                                    border: `1.5px solid ${alpha('#1B8A5A', 0.1)}`
                                }}
                            >
                                {user.name[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{user.email}</Typography>
                                {user.lastLogin && (
                                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.6rem' }}>
                                        Seen: {new Date(user.lastLogin).toLocaleDateString()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Chip label={user.status} size="small" />
                    </Box>
                    );
                }}
            />

            <BulkActionBanner
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
                actions={bulkActions}
            />
        </Container>
    );
}
