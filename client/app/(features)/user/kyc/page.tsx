import React from 'react';
import KycPageClient from './KycPageClient';
import { kycApi } from '@/store/api/kyc.api';
import store from '@/store';

export default async function KycPage() {
    const result = await store.dispatch(kycApi.endpoints.getKycConfig.initiate());
    const config = result.data || { DOCUMENT_TYPES: [], MAJOR_BANKS: [] };

    return <KycPageClient config={config} />;
}
