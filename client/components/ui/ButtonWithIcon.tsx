import { BRAND } from "@/app/theme";
import React from "react";
import { Button, Box, Typography, alpha } from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { SvgIconComponent } from "@mui/icons-material";

interface Props {
    text?: string;
    icon?: SvgIconComponent | null;
    side?: 'left' | 'right';
    needAnimation?: boolean;
    variant?: 'contained' | 'outlined' | 'text';
    size?: 'sm' | 'md' | 'lg' | { xs: 'sm' | 'md'; md: 'md' | 'lg'; lg?: 'lg' };
    color?: 'primary' | 'secondary' | 'black' | 'white'; // Controls the BUTTON look
    textColor?: 'primary' | 'secondary' | 'black' | 'white'; // Controls the TEXT only
    onClick?: () => void;
}

const ButtonWithIcon = ({
    text = "Get Started",
    icon: Icon = NorthEastIcon,
    side = "right",
    needAnimation = true,
    variant = 'contained',
    size = 'md',
    color = 'primary',
    textColor,
    onClick
}: Props) => {

    // 1. Theme strictly controls Backgrounds and Icons
    const themeMap = {
        primary: { bg: BRAND.primary[600], iconBg: BRAND.primary[400], iconColor: BRAND.white },
        secondary: { bg: BRAND.secondary[500], iconBg: BRAND.primary[600], iconColor: BRAND.secondary[500] },
        black: { bg: BRAND.inkDark, iconBg: BRAND.muted, iconColor: BRAND.white },
        white: { bg: BRAND.white, iconBg: BRAND.lightBg, iconColor: BRAND.primary[600] }
    };

    // 2. Separate logic for Text Color
    const textMap = {
        primary: BRAND.primary[600],
        secondary: BRAND.secondary[500],
        black: BRAND.inkDark,
        white: BRAND.white
    };

    const theme = themeMap[color] || themeMap.primary;
    
    // If textColor prop is passed, use it; otherwise fallback to a sensible default (like white for contained, or black/primary for others)
    const finalTextColor = textColor 
        ? textMap[textColor] 
        : (variant === 'contained' ? BRAND.white : textMap[color]);

    const config = {
        sm: { height: 36, iconSize: 26, fontSize: "0.8rem", px: side === "right" ? "4px 6px 4px 16px" : "4px 16px 4px 6px", gap: 1 },
        md: { height: 42, iconSize: 30, fontSize: "0.85rem", px: side === "right" ? "4px 6px 4px 18px" : "4px 18px 4px 6px", gap: 1.2 },
        lg: { height: 48, iconSize: 34, fontSize: "0.95rem", px: side === "right" ? "6px 8px 6px 22px" : "6px 22px 6px 8px", gap: 1.5 },
    };

    const getStyles = (sz: any) => config[sz as keyof typeof config];

    return (
        <Button
            onClick={onClick}
            variant={variant}
            color="inherit"
            disableElevation
            sx={{
                height: typeof size === 'object' ? { xs: getStyles(size.xs).height, md: getStyles(size.md).height, lg: getStyles(size.lg || 'lg').height } : getStyles(size).height,
                
                // Now strictly controlled by the independent textColor logic
                color: `${finalTextColor} !important`,
                backgroundColor: variant === 'contained' ? `${theme.bg} !important` : "transparent !important",
                
                ...(variant === 'outlined' ? {
                    background: alpha(theme.bg, 0.05),
                    backdropFilter: "blur(8px)",
                    border: `1.5px solid ${alpha(theme.bg, 0.4)}`,
                } : {}),

                borderRadius: "50px",
                padding: typeof size === 'object' ? { xs: getStyles(size.xs).px, md: getStyles(size.md).px, lg: getStyles(size.lg || 'lg').px } : getStyles(size).px,
                textTransform: "none",
                display: "inline-flex",
                flexDirection: side === "right" ? "row" : "row-reverse",
                alignItems: "center",
                gap: typeof size === 'object' ? { xs: getStyles(size.xs).gap, md: getStyles(size.md).gap } : getStyles(size).gap,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-1px)",
                    backgroundColor: variant === 'contained' ? alpha(theme.bg, 0.9) : alpha(theme.bg, 0.1),
                }
            }}
        >
            <Typography sx={{ fontWeight: 600, fontSize: "inherit", lineHeight: 1, whiteSpace: "nowrap", color: "inherit" }}>
                {text}
            </Typography>

            {Icon && (
                <Box sx={{
                    width: typeof size === 'object' ? { xs: getStyles(size.xs).iconSize, md: getStyles(size.md).iconSize } : getStyles(size).iconSize,
                    height: typeof size === 'object' ? { xs: getStyles(size.xs).iconSize, md: getStyles(size.md).iconSize } : getStyles(size).iconSize,
                    borderRadius: "50%",
                    // These remain tied to the theme, not the text color
                    backgroundColor: theme.iconBg,
                    color: theme.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    ".MuiButton-root:hover &": { transform: needAnimation ? "rotate(45deg)" : "none" },
                }}>
                    <Icon sx={{ fontSize: "120%" }} />
                </Box>
            )}
        </Button>
    );
};

export default ButtonWithIcon;