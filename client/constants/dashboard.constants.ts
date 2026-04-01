export const DASHBOARD_STRINGS = {
    WELCOME: "Welcome, ",
    SUBTITLE: "Here's what's happening with your crop auctions today.",
    FARMER_SUPPORT: "Place to support our farmers",
    FARMER_SUPPORT_SUB: "Farmers are the backbone of our nation. Every grain of rice, every vegetable, every fruit on our table is the result of their hard work, dedication, and sacrifice. Yet, many farmers face daily challenges — unpredictable weather, rising costs, market instability, and limited access to modern tools.",
};

export const QUICK_ACCESS_ACTIONS = [
    { label: 'Buy Items', sub: 'Create bid on listed stocks', color: '#6A1B9A', path: '/auctions' }, // Deep Purple
    { label: 'Wallet', sub: 'See all transactions', color: '#0277BD', path: '/wallet' }, // Light Blue
    { label: 'SELL CROPS', sub: 'You can list and sell crops', color: '#EF6C00', path: '/auctions/create' }, // Orange
    { label: 'My Bids', sub: 'Show active bids', color: '#00838F', path: '/user/bids' }, // Teal
];

export const MANAGEMENT_ACTIONS = [
    { label: 'My Auctions', sub: 'View and manage created auctions list', color: '#1A237E', path: '/user/auctions' },
    { label: 'My Bids', sub: 'View and manage created Bids', color: '#26C6DA', path: '/user/bids' },
];
