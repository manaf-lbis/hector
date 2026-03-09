
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
    }[]
}


const NavLinks = ({navLinks}:Props) => {
    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, flex: 1, justifyContent: 'center' }}>
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                    <Typography
                        component="span"
                        sx={{
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: 'rgba(0, 0, 0, 0.7)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                color: BRAND.primary[400],
                            },
                        }}
                    >
                        {link.label}
                    </Typography>
                </Link>
            ))}
        </Box>
    )
}

export default NavLinks