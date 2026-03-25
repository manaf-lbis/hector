"use client";

import { Box, alpha } from "@mui/material";
import { BRAND } from "@/app/theme";

// The programmatic coconut leaf we built
const CoconutLeafSVG = () => {
    const paths = [];
    const p0 = { x: 50, y: 450 };
    const p1 = { x: 150, y: 150 };
    const p2 = { x: 450, y: 50 };

    paths.push(<path key="spine" d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`} stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />);

    const numLeaflets = 45;
    for (let i = 2; i < numLeaflets; i++) {
        const t = i / numLeaflets;
        const mt = 1 - t;

        const px = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
        const py = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;

        const tx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        const ty = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
        const len = Math.sqrt(tx * tx + ty * ty);
        
        const nx = -ty / len;
        const ny = tx / len;

        const leafLen = 160 * Math.sin(t * Math.PI) * (1 - 0.2 * t * t);
        const droopFactor = 0.65;

        const tipXL = px + nx * leafLen + (tx / len) * leafLen * droopFactor;
        const tipYL = py + ny * leafLen + (ty / len) * leafLen * droopFactor;
        const cx1L = px + nx * leafLen * 0.5 + (tx / len) * leafLen * 0.2;
        const cy1L = py + ny * leafLen * 0.5 + (ty / len) * leafLen * 0.2;
        const cx2L = px + nx * leafLen * 0.4 - (tx / len) * leafLen * 0.1;
        const cy2L = py + ny * leafLen * 0.4 - (ty / len) * leafLen * 0.1;

        paths.push(
            <path key={`L${i}`} d={`M ${px} ${py} Q ${cx1L} ${cy1L} ${tipXL} ${tipYL} Q ${cx2L} ${cy2L} ${px} ${py} Z`} fill="currentColor" opacity={0.8 + 0.2 * Math.sin(t * Math.PI)} />
        );

        const tipXR = px - nx * leafLen * 0.8 + (tx / len) * leafLen * droopFactor;
        const tipYR = py - ny * leafLen * 0.8 + (ty / len) * leafLen * droopFactor;
        const cx1R = px - nx * leafLen * 0.4 + (tx / len) * leafLen * 0.1;
        const cy1R = py - ny * leafLen * 0.4 + (ty / len) * leafLen * 0.1;
        const cx2R = px - nx * leafLen * 0.3 - (tx / len) * leafLen * 0.1;
        const cy2R = py - ny * leafLen * 0.3 - (ty / len) * leafLen * 0.1;

        paths.push(
             <path key={`R${i}`} d={`M ${px} ${py} Q ${cx1R} ${cy1R} ${tipXR} ${tipYR} Q ${cx2R} ${cy2R} ${px} ${py} Z`} fill="currentColor" opacity={0.8 + 0.2 * Math.sin(t * Math.PI)} />
        );
    }

    return (
        <svg width="100%" height="100%" viewBox="-100 -50 700 700" style={{ filter: 'drop-shadow(4px 8px 12px rgba(0,0,0,0.06))' }}>
            {paths}
        </svg>
    );
};

// A broad tropical leaf (banana leaf style)
const BroadLeafSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 600" style={{ filter: 'drop-shadow(4px 8px 12px rgba(0,0,0,0.06))' }}>
        <path 
            fill="currentColor"
            d="M 100 580 C 20 450, -10 300, 30 100 C 40 30, 100 10, 100 10 C 100 10, 160 30, 170 100 C 210 300, 180 450, 100 580 Z"
        />
        {/* Vein slits for detail */}
        <path d="M 100 580 Q 95 300 100 10" stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" />
        <path d="M 100 450 Q 60 400 20 420" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
        <path d="M 100 350 Q 150 300 190 320" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
        <path d="M 100 250 Q 40 200 15 230" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
        <path d="M 100 150 Q 140 100 165 120" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
    </svg>
);

export default function AppBackground() {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                background: `linear-gradient(135deg, ${BRAND.lightBg} 0%, #FFFFFF 40%, #EEF7F0 100%)`,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}
        >
            {/* LUSH TROPICAL FRAMING */}

            {/* Left large coconut leaf */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-5%',
                    left: { xs: '-30%', md: '-20%' },
                    width: { xs: '600px', md: '900px' },
                    height: { xs: '600px', md: '900px' },
                    color: alpha(BRAND.primary[500], 0.09),
                    transform: 'rotate(5deg)',
                }}
            >
                <CoconutLeafSVG />
            </Box>

            {/* Bottom Left broad leaf */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-5%',
                    width: { xs: '300px', md: '450px' },
                    height: { xs: '300px', md: '450px' },
                    color: alpha(BRAND.primary[600], 0.05),
                    transform: 'rotate(45deg)',
                }}
            >
                <BroadLeafSVG />
            </Box>

            {/* Top Right small coconut leaf */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-15%',
                    right: { xs: '-20%', md: '-10%' },
                    width: { xs: '500px', md: '700px' },
                    height: { xs: '500px', md: '700px' },
                    color: alpha(BRAND.primary[600], 0.07),
                    transform: 'rotate(120deg) scaleX(-1)',
                }}
            >
                <CoconutLeafSVG />
            </Box>

            {/* Right Middle broad leaf crop */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '30%',
                    right: '-8%',
                    width: { xs: '200px', md: '300px' },
                    height: { xs: '200px', md: '300px' },
                    color: alpha(BRAND.secondary[500], 0.06),
                    transform: 'rotate(-45deg)',
                }}
            >
                <BroadLeafSVG />
            </Box>

            {/* Bottom Right huge coconut leaf */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: { xs: '-20%', md: '-25%' },
                    right: { xs: '-30%', md: '-15%' },
                    width: { xs: '700px', md: '1000px' },
                    height: { xs: '700px', md: '1000px' },
                    color: alpha(BRAND.secondary[500], 0.08),
                    transform: 'rotate(215deg)',
                }}
            >
                <CoconutLeafSVG />
            </Box>
        </Box>
    );
}
