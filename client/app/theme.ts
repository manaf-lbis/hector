import { createTheme, alpha } from "@mui/material/styles";
import './globals.css'

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const BRAND = {
    primary: {
        950: "#010C06",
        900: "#021309",
        850: "#031A0E",
        800: "#052614",
        700: "#0A3D26",
        600: "#126640",  // PRIMARY — main brand green
        500: "#1B8A5A",
        400: "#24AA6E",
    },
    secondary: {
        500: "#A8E63D",  // SECONDARY — highlight / CTA accent
        400: "#BDED5A",
        300: "#D0F57D",
    },
    white: "#FFFFFF",
    offWhite: "#F7FBF9",
    lightBg: "#F5FAF7",
    inkDark: "#060E08",
    muted: "#5A7A64",
};

// ─────────────────────────────────────────────────────────────────────────────
// GLASSMORPHISM — primary (green-tinted glass) & secondary (secondary-tinted glass)
// ─────────────────────────────────────────────────────────────────────────────
export const glass = {
    // Subtle — navbars, breadcrumbs, light overlays
    subtle: {
        background: alpha(BRAND.white, 0.55),
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        border: `1px solid ${alpha(BRAND.white, 0.7)}`,
    },

    // Primary glass — cards, panels, surfaces
    primary: {
        background: alpha(BRAND.white, 0.65),
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${alpha(BRAND.white, 0.8)}`,
        boxShadow: `0 8px 32px ${alpha(BRAND.inkDark, 0.08)}, inset 0 1px 0 ${alpha(BRAND.white, 0.9)}`,
    },

    // Secondary glass — modals, drawers, dialogs
    secondary: {
        background: alpha(BRAND.white, 0.8),
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        border: `1px solid ${alpha(BRAND.white, 0.9)}`,
        boxShadow: `0 24px 80px ${alpha(BRAND.inkDark, 0.12)}, inset 0 1px 0 ${alpha(BRAND.white, 1)}`,
    },

    // secondary accent glass — badges, tags, highlights
    lime: {
        background: alpha(BRAND.secondary[500], 0.2),
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${alpha(BRAND.secondary[500], 0.4)}`,
        color: BRAND.primary[700],
    },

    // Emerald glass — stat cards, feature panels
    emerald: {
        background: alpha(BRAND.primary[600], 0.08),
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: `1px solid ${alpha(BRAND.primary[500], 0.3)}`,
        boxShadow: `0 4px 20px ${alpha(BRAND.primary[600], 0.2)}`,
    },

    emeraldNav: {

        backgroundColor: alpha(BRAND.primary[850], .82),

        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${alpha(BRAND.white, 0.12)}`,
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND — layered field/crop atmosphere
// ─────────────────────────────────────────────────────────────────────────────
export const appBackground = {
    // Use on <body> or root layout wrapper
    background: `
    radial-gradient(ellipse 100% 60% at 20% 0%, ${alpha(BRAND.primary[400], 0.18)} 0%, transparent 55%),
    radial-gradient(ellipse 80% 50% at 80% 10%, ${alpha(BRAND.secondary[500], 0.12)} 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 50% 100%, ${alpha(BRAND.primary[600], 0.1)} 0%, transparent 60%),
    linear-gradient(160deg, #EEF7F0 0%, #F5FAF7 40%, #F0F9EC 100%)
  `,
    minHeight: "100vh",
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────
export const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: BRAND.primary[600],
            light: BRAND.primary[500],
            dark: BRAND.primary[700],
            contrastText: BRAND.white,
        },

        secondary: {
            main: BRAND.secondary[500],
            light: BRAND.secondary[400],
            dark: "#8AC82A",
            contrastText: BRAND.primary[800],
        },

        background: {
            default: BRAND.lightBg,
            paper: BRAND.white,
        },

        text: {
            primary: BRAND.inkDark,
            secondary: BRAND.muted,
            disabled: alpha(BRAND.inkDark, 0.3),
        },

        divider: alpha(BRAND.primary[600], 0.12),

        action: {
            hover: alpha(BRAND.primary[600], 0.06),
            selected: alpha(BRAND.primary[600], 0.1),
            focus: alpha(BRAND.primary[600], 0.12),
            disabledBackground: alpha(BRAND.inkDark, 0.06),
        },
    },

    typography: {
        fontFamily: "var(--font-roboto)",
        button: {
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.01em",
        },
    },

    shape: { borderRadius: 8 },

    components: {
        // ── CSS BASELINE ────────────────────────────────────────────────────────
        MuiCssBaseline: {
            styleOverrides: {
                "*, *::before, *::after": { boxSizing: "border-box" },
                html: { scrollBehavior: "smooth" },
                body: {
                    margin: 0,
                    ...appBackground,
                    color: BRAND.inkDark,
                    transition: "background-color 0.3s ease",
                },
                "::-webkit-scrollbar": { width: "6px" },
                "::-webkit-scrollbar-track": { background: BRAND.lightBg },
                "::-webkit-scrollbar-thumb": {
                    background: alpha(BRAND.primary[600], 0.3),
                    borderRadius: "3px",
                },
                "::-webkit-scrollbar-thumb:hover": { background: BRAND.primary[500] },
                "::selection": {
                    background: alpha(BRAND.secondary[500], 0.3),
                    color: BRAND.primary[800],
                },
            },
        },

        // ── APP BAR ─────────────────────────────────────────────────────────────
        MuiAppBar: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    ...glass.subtle,
                    border: "none",
                    borderBottom: "none",
                    backgroundImage: "none"
                }
            }
        },

        MuiToolbar: {
            styleOverrides: {
                root: { minHeight: "68px !important" },
            },
        },

        // ── PAPER ───────────────────────────────────────────────────────────────
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    ...glass.primary,
                    borderRadius: 20,
                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                },
            },
        },

        // ── CARD ────────────────────────────────────────────────────────────────
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    ...glass.primary,
                    borderRadius: 16,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: `0 16px 48px ${alpha(BRAND.inkDark, 0.12)}, 0 0 0 1px ${alpha(BRAND.primary[600], 0.15)}`,
                    },
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: { padding: "24px", "&:last-child": { paddingBottom: "24px" } },
            },
        },

        // ── BUTTON ──────────────────────────────────────────────────────────────
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 100,
                    padding: "10px 28px",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:active": { transform: "scale(0.96)" },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${BRAND.primary[600]} 0%, ${BRAND.primary[500]} 100%)`,
                    boxShadow: `0 4px 14px ${alpha(BRAND.primary[600], 0.35)}`,
                    "&:hover": {
                        background: `linear-gradient(135deg, ${BRAND.primary[500]} 0%, ${BRAND.primary[400]} 100%)`,
                        boxShadow: `0 8px 25px ${alpha(BRAND.primary[600], 0.45)}`,
                        transform: "translateY(-1px)",
                    },
                },
                containedSecondary: {
                    background: BRAND.secondary[500],
                    color: BRAND.primary[800],
                    boxShadow: `0 4px 14px ${alpha(BRAND.secondary[500], 0.4)}`,
                    "&:hover": {
                        background: BRAND.secondary[400],
                        boxShadow: `0 8px 25px ${alpha(BRAND.secondary[500], 0.5)}`,
                        transform: "translateY(-1px)",
                    },
                },
                outlinedPrimary: {
                    border: `1.5px solid ${alpha(BRAND.primary[600], 0.4)}`,
                    background: alpha(BRAND.primary[600], 0.05),
                    backdropFilter: "blur(8px)",
                    color: BRAND.primary[600],
                    "&:hover": {
                        border: `1.5px solid ${BRAND.primary[600]}`,
                        background: alpha(BRAND.primary[600], 0.1),
                        transform: "translateY(-1px)",
                    },
                },
                textPrimary: {
                    color: BRAND.primary[600],
                    "&:hover": { background: alpha(BRAND.primary[600], 0.08) },
                },
                sizeSmall: { padding: "6px 18px", fontSize: "0.8125rem" },
                sizeLarge: { padding: "14px 40px", fontSize: "1.0625rem" },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    transition: "all 0.2s ease",
                    "&:hover": {
                        background: alpha(BRAND.primary[600], 0.08),
                        transform: "scale(1.05)",
                    },
                },
            },
        },

        // ── CHIP ────────────────────────────────────────────────────────────────
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 100, fontWeight: 600, fontSize: "0.75rem" },
                colorPrimary: {
                    ...glass.emerald,
                    color: BRAND.primary[600],
                },
                colorSecondary: {
                    ...glass.secondary,
                    color: BRAND.primary[700],
                },
                outlined: {
                    border: `1.5px solid ${alpha(BRAND.primary[600], 0.25)}`,
                    background: "transparent",
                },
            },
        },

        // ── TEXT FIELD ──────────────────────────────────────────────────────────
        MuiTextField: { defaultProps: { variant: "outlined" } },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    ...glass.primary,
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(BRAND.primary[800], 0.2),
                        transition: "border-color 0.3s ease",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(BRAND.primary[600], 0.4),
                    },
                    "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: BRAND.primary[600],
                            borderWidth: "1.5px",
                        },
                    },
                },
                input: {
                    color: BRAND.inkDark,
                    "&::placeholder": { color: BRAND.muted, opacity: 1 },
                },
            },
        },


        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: BRAND.primary[700],
                    fontWeight: 400,

                    "&.Mui-focused": {
                        color: BRAND.primary[800],
                        fontWeight: 600, 
                    },

                    "&.MuiInputLabel-shrink": {
                        color: BRAND.primary[500], 
                    },
                },
            },
        },

        // ── MENU ────────────────────────────────────────────────────────────────
        MuiMenu: {
            styleOverrides: {
                paper: { ...glass.secondary, borderRadius: 8, minWidth: 200 },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: "2px 8px",
                    padding: "10px 16px",
                    fontSize: "0.9rem",
                    "&:hover": { background: alpha(BRAND.primary[600], 0.08) },
                    "&.Mui-selected": {
                        background: alpha(BRAND.primary[600], 0.1),
                        color: BRAND.primary[600],
                    },
                },
            },
        },

        // ── DIALOG ──────────────────────────────────────────────────────────────
        MuiDialog: {
            styleOverrides: {
                paper: { ...glass.secondary, borderRadius:12 },
                root: {
                    "& .MuiBackdrop-root": {
                        backdropFilter: "blur(8px)",
                        backgroundColor: alpha(BRAND.inkDark, 0.3),
                    },
                },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: { fontWeight: 700, fontSize: "1.25rem", padding: "24px 28px 16px" },
            },
        },
        MuiDialogContent: {
            styleOverrides: { root: { padding: "8px 28px 20px" } },
        },
        MuiDialogActions: {
            styleOverrides: { root: { padding: "12px 28px 24px", gap: 8 } },
        },

        // ── DRAWER ──────────────────────────────────────────────────────────────
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    ...glass.secondary,
                    border: "none",
                    borderRight: `1px solid ${alpha(BRAND.primary[600], 0.1)}`,
                },
            },
        },

        // ── TABLE ───────────────────────────────────────────────────────────────
        MuiTableContainer: {
            styleOverrides: {
                root: { ...glass.primary, borderRadius: 20, overflow: "hidden" },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-head": {
                        background: alpha(BRAND.primary[600], 0.06),
                        color: BRAND.primary[700],
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        borderBottom: `1px solid ${alpha(BRAND.primary[600], 0.12)}`,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": { background: alpha(BRAND.primary[600], 0.04) },
                    "&:last-child .MuiTableCell-root": { borderBottom: "none" },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha(BRAND.primary[600], 0.08)}`,
                    padding: "14px 20px",
                    fontSize: "0.9rem",
                },
            },
        },

        // ── TABS ────────────────────────────────────────────────────────────────
        MuiTabs: {
            styleOverrides: {
                root: { ...glass.subtle, borderRadius: 100, padding: "4px", minHeight: 44 },
                indicator: {
                    height: "100%",
                    borderRadius: 100,
                    background: `linear-gradient(135deg, ${BRAND.primary[600]}, ${BRAND.primary[500]})`,
                    zIndex: 0,
                    boxShadow: `0 4px 12px ${alpha(BRAND.primary[600], 0.4)}`,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    zIndex: 1,
                    borderRadius: 100,
                    minHeight: 36,
                    padding: "6px 20px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: BRAND.muted,
                    "&.Mui-selected": { color: BRAND.white },
                },
            },
        },

        // ── TOOLTIP ─────────────────────────────────────────────────────────────
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    ...glass.secondary,
                    borderRadius: 10,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    padding: "8px 14px",
                    color: BRAND.inkDark,
                },
                arrow: { color: alpha(BRAND.white, 0.95) },
            },
        },

        // ── BADGE ───────────────────────────────────────────────────────────────
        MuiBadge: {
            styleOverrides: {
                badge: {
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    "&.MuiBadge-colorPrimary": {
                        background: BRAND.secondary[500],
                        color: BRAND.primary[800],
                    },
                },
            },
        },

        // ── AVATAR ──────────────────────────────────────────────────────────────
        MuiAvatar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(135deg, ${BRAND.primary[600]}, ${BRAND.primary[500]})`,
                    color: BRAND.white,
                    fontWeight: 700,
                    border: `2px solid ${alpha(BRAND.primary[500], 0.3)}`,
                },
            },
        },

        // ── PROGRESS ────────────────────────────────────────────────────────────
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 100,
                    height: 6,
                    backgroundColor: alpha(BRAND.primary[600], 0.1),
                },
                bar: {
                    borderRadius: 100,
                    background: `linear-gradient(90deg, ${BRAND.primary[600]}, ${BRAND.secondary[500]})`,
                },
            },
        },
        MuiCircularProgress: {
            defaultProps: { color: "secondary" },
            styleOverrides: { root: { color: BRAND.secondary[500] } },
        },

        // ── SWITCH ──────────────────────────────────────────────────────────────
        MuiSwitch: {
            styleOverrides: {
                root: { padding: 4 },
                track: {
                    borderRadius: 100,
                    backgroundColor: alpha(BRAND.inkDark, 0.15),
                    opacity: 1,
                },
                switchBase: {
                    "&.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: BRAND.primary[600],
                        opacity: 1,
                    },
                },
            },
        },

        // ── CHECKBOX / RADIO ────────────────────────────────────────────────────
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: alpha(BRAND.inkDark, 0.3),
                    "&.Mui-checked": { color: BRAND.primary[500] },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: alpha(BRAND.inkDark, 0.3),
                    "&.Mui-checked": { color: BRAND.primary[500] },
                },
            },
        },

        // ── SLIDER ──────────────────────────────────────────────────────────────
        MuiSlider: {
            styleOverrides: {
                root: { color: BRAND.primary[500] },
                track: {
                    background: `linear-gradient(90deg, ${BRAND.primary[600]}, ${BRAND.secondary[500]})`,
                    border: "none",
                },
                rail: { backgroundColor: alpha(BRAND.primary[600], 0.15) },
                thumb: {
                    background: BRAND.white,
                    border: `2px solid ${BRAND.primary[500]}`,
                    boxShadow: `0 2px 8px ${alpha(BRAND.primary[600], 0.4)}`,
                    "&:hover": { boxShadow: `0 4px 16px ${alpha(BRAND.primary[600], 0.5)}` },
                },
            },
        },

        // ── ACCORDION ───────────────────────────────────────────────────────────
        MuiAccordion: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    ...glass.primary,
                    borderRadius: "16px !important",
                    marginBottom: 8,
                    "&:before": { display: "none" },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: { padding: "0 20px", minHeight: 56, fontWeight: 600 },
            },
        },

        // ── ALERT ───────────────────────────────────────────────────────────────
        MuiAlert: {
            styleOverrides: {
                root: { borderRadius: 14, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" },
                standardSuccess: {
                    background: alpha(BRAND.primary[600], 0.08),
                    border: `1px solid ${alpha(BRAND.primary[500], 0.3)}`,
                    color: BRAND.primary[700],
                },
                standardWarning: {
                    background: alpha("#F59E0B", 0.08),
                    border: `1px solid ${alpha("#F59E0B", 0.3)}`,
                },
                standardError: {
                    background: alpha("#EF4444", 0.08),
                    border: `1px solid ${alpha("#EF4444", 0.3)}`,
                },
                standardInfo: {
                    background: alpha("#3B82F6", 0.08),
                    border: `1px solid ${alpha("#3B82F6", 0.3)}`,
                },
            },
        },

        // ── MISC ────────────────────────────────────────────────────────────────
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: alpha(BRAND.primary[600], 0.1) },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    margin: "2px 0",
                    "&:hover": { background: alpha(BRAND.primary[600], 0.06) },
                    "&.Mui-selected": {
                        background: alpha(BRAND.primary[600], 0.1),
                        color: BRAND.primary[600],
                    },
                },
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    "&.Mui-selected": {
                        background: `linear-gradient(135deg, ${BRAND.primary[600]}, ${BRAND.primary[500]})`,
                        color: BRAND.white,
                        boxShadow: `0 4px 12px ${alpha(BRAND.primary[600], 0.4)}`,
                    },
                },
            },
        },
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: alpha(BRAND.primary[600], 0.06),
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(135deg, ${BRAND.primary[600]}, ${BRAND.primary[500]})`,
                    color: BRAND.white,
                    boxShadow: `0 8px 24px ${alpha(BRAND.primary[600], 0.45)}`,
                    "&:hover": {
                        background: `linear-gradient(135deg, ${BRAND.primary[500]}, ${BRAND.primary[400]})`,
                        transform: "translateY(-2px)",
                    },
                    transition: "all 0.25s ease",
                },
            },
        },
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** sx() shorthand: <Box sx={glassSx.primary} /> */
export const glassSx = {
    primary: glass.primary,
    secondary: glass.secondary,
    subtle: glass.subtle,
    emerald: glass.emerald,
};

/** Gradient helpers */
export const gradients = {
    primary: `linear-gradient(135deg, ${BRAND.primary[700]} 0%, ${BRAND.primary[600]} 50%, ${BRAND.primary[500]} 100%)`,
    secondary: `linear-gradient(135deg, ${BRAND.secondary[500]} 0%, ${BRAND.secondary[400]} 100%)`,
    hero: `linear-gradient(160deg, #EEF7F0 0%, #F5FAF7 40%, #F0F9EC 100%)`,
    glow: `radial-gradient(ellipse at center, ${alpha(BRAND.primary[600], 0.1)} 0%, transparent 70%)`,
};