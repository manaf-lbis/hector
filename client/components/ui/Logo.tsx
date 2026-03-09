import { Typography } from "@mui/material"
import Link from "next/link"

const Logo = ({ navigateTo }: { navigateTo: string }) => {
    return (
        <Link href={navigateTo} style={{ textDecoration: 'none' }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    background: 'black',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    cursor: 'pointer',
                }}
            >
                Hector
            </Typography>
        </Link>

    )
}

export default Logo