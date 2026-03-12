import { AppBar, Toolbar, Container, Button, Box } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import CustomMenu from "../ui/CustomMenu";
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CallIcon from '@mui/icons-material/Call';
import Logo from "../ui/Logo";
import NavLinks from "../ui/navbar/NavLinks";
import ButtonWithIcon from "../ui/ButtonWithIcon";
import Link from "next/link";

const navLinks = [
    { id: 1, label: 'Home', href: '/', icon: HomeIcon },
    { id: 2, label: 'About Us', href: '/about', icon: InfoOutlineIcon },
    { id: 3, label: 'Services', href: '/services', icon: MiscellaneousServicesIcon },
    { id: 4, label: 'Contact', href: '/contact', icon: CallIcon },
]

const Navbar = () => {
    return (
        <AppBar position="fixed" sx={{ borderRadius: 0, top: 0, }}>
            <Container maxWidth="xl">
                <Toolbar
                    sx={{
                        minHeight: { xs: 56, md: 64 },
                        px: { xs: 2, md: 4 },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >

                    <Logo navigateTo="/" />

                    <NavLinks navLinks={navLinks} />

                    {/* Right Buttons - Desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                        <Button
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: 'rgba(0, 0, 0, 0.7)',
                                '&:hover': {
                                    color: '#000',
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                },
                            }}
                        >
                            Sign In
                        </Button>

                    <Link href='/auth/login'>
                        <ButtonWithIcon variant="outlined" size="md" color="primary"  />
                    </Link>


                    </Box>

                    <CustomMenu
                        trigger={
                            <MenuIcon
                                sx={{ display: { md: 'none' } }}
                                // onClick={() => { }}
                                color="primary"
                            />
                        }

                        items={navLinks.map((ele) => {
                            return {
                                label: ele.label,
                                id: ele.id,
                                icon: ele.icon
                            }
                        })}
                    />

                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar

