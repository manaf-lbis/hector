
import { BRAND } from '@/app/theme'
import { SvgIconComponent } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'

interface Props {
    navLinks: {
        id: number | string,
        label: string,
        href: string,
        icon: SvgIconComponent
    }[];
    showIcons?: boolean;
}


const NavLinks = ({navLinks, showIcons = false}:Props) => {
    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, flex: 1, justifyContent: 'center' }}>
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.8,
                        color: 'rgba(0, 0, 0, 0.7)',
                        transition: 'all 0.3s ease',
                        '&:hover': { color: BRAND.primary[400] }
                    }}>
                        {showIcons && link.icon && <link.icon sx={{ fontSize: '1.2rem' }} />}
                        <Typography
                            component="span"
                            sx={{
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            }}
                        >
                            {link.label}
                        </Typography>
                    </Box>
                </Link>
            ))}
        </Box>
    )
}

export default NavLinks