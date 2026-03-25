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
    Stack
} from '@mui/material';
import { 
    AssignmentInd as KycIcon,
    PendingActions as PendingIcon,
    CheckCircle as ApprovedIcon,
    Error as RejectedIcon,
    Visibility as VisibilityIcon,
    Schedule as ClockIcon
} from '@mui/icons-material';
import { useGetPendingKycQuery } from '@/store/api/kyc.api';
import AdminPageHeader from '@/components/ui/admin/AdminPageHeader';
import AdminStatsCard from '@/components/ui/admin/AdminStatsCard';
import AdminTable, { AdminTableColumn } from '@/components/ui/admin/AdminTable';
import AdminSearch from '@/components/ui/admin/AdminSearch';
import AdminFilter from '@/components/ui/admin/AdminFilter';
import AppButton from '@/components/ui/AppButton';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminKycPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data: result, isLoading } = useGetPendingKycQuery({
        search: debouncedSearch,
        status: selectedStatus
    });
    
    const kycData = result?.kycList || [];

    const handleRowClick = (kyc: any) => {
        router.push(`/admin/users/${kyc.user?._id}`);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
    };

    const showClear = searchTerm !== '' || selectedStatus !== 'all';

    const filteredKyc = kycData; // Already filtered server-side

    const columns: AdminTableColumn[] = [
        {
            id: 'user',
            label: 'User Details',
            render: (kyc: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        sx={{ 
                            width: 36, height: 36, 
                            bgcolor: alpha('#1B8A5A', 0.1), 
                            color: '#1B8A5A',
                            fontWeight: 700
                        }}
                    >
                        {kyc.user?.name?.charAt(0).toUpperCase() || '?'}
                    </Avatar>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                {kyc.user?.name || 'Unknown'}
                            </Typography>
                            {kyc.user?.customId && (
                                <Chip 
                                    label={`ID: ${kyc.user.customId}`} 
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
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {kyc.user?.email}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'documentType',
            label: 'Document',
            render: (kyc: any) => (
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    {kyc.documentType}
                </Typography>
            )
        },
        {
            id: 'status',
            label: 'Status',
            align: 'center',
            render: (kyc: any) => (
                <Chip 
                    icon={<ClockIcon sx={{ fontSize: '14px !important' }} />}
                    label={kyc.kycStatus?.toUpperCase()} 
                    size="small" 
                    color={kyc.kycStatus === 'approved' ? 'success' : kyc.kycStatus === 'rejected' ? 'error' : 'warning'}
                    sx={{ fontWeight: 700, borderRadius: '16px', px: 1 }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Action',
            align: 'right',
            render: (kyc: any) => (
                <AppButton 
                    variant="outlined" 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); handleRowClick(kyc); }}
                >
                    Review Application
                </AppButton>
            )
        }
    ];

    const stats = [
        { label: 'Pending KYC', value: result?.counts?.pending || 0, icon: PendingIcon, color: '#F59E0B' },
        { label: 'Total Requests', value: result?.counts?.all || 0, icon: KycIcon, color: '#1B8A5A' },
        { label: 'Approved Today', value: result?.counts?.approved || 0, icon: ApprovedIcon, color: '#A8E63D' },
        { label: 'Rejected Today', value: result?.counts?.rejected || 0, icon: RejectedIcon, color: '#EF4444' }
    ];

    const filterOptions = [
        { label: 'All Requests', value: 'all', count: result?.counts?.all },
        { label: 'Pending', value: 'pending', count: (result?.counts?.pending || 0) + (result?.counts?.resubmitted || 0) },
        { label: 'Approved', value: 'approved', count: result?.counts?.approved },
        { label: 'Returned', value: 'returned', count: result?.counts?.returned },
        { label: 'Rejected', value: 'rejected', count: result?.counts?.rejected }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
            <AdminPageHeader 
                title="KYC Management"
                subtitle={`Verify user identities and processing ${result?.counts?.pending || 0} active requests.`}
                stats={stats}
            />


            <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={3} 
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
                sx={{ mb: 4 }}
            >
                <AdminSearch 
                    value={searchTerm} 
                    onChange={setSearchTerm} 
                    placeholder="Search by User Name or Email..."
                />
                <AdminFilter 
                    options={filterOptions} 
                    activeValue={selectedStatus} 
                    onSelect={setSelectedStatus} 
                    onClear={handleClearFilters}
                    showClear={showClear}
                />
            </Stack>

            <AdminTable 
                columns={columns}
                data={filteredKyc}
                totalCount={filteredKyc.length}
                isLoading={isLoading}
                page={0}
                rowsPerPage={filteredKyc.length}
                onPageChange={() => {}} 
                onRowClick={handleRowClick}
                renderMobileCard={(kyc) => (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: alpha('#1B8A5A', 0.1), color: '#1B8A5A' }}>{kyc.user?.name[0]}</Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{kyc.user?.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{kyc.documentType}</Typography>
                            </Box>
                        </Box>
                        <Chip 
                            label={kyc.kycStatus?.toUpperCase()} 
                            size="small" 
                            color={kyc.kycStatus === 'approved' ? 'success' : kyc.kycStatus === 'rejected' ? 'error' : 'warning'}
                        />
                    </Box>
                )}
            />
        </Container>
    );
}
