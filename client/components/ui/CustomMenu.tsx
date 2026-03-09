'use client'

import { SvgIconComponent } from "@mui/icons-material";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

interface Items {
    id: number;
    label: string;
    icon?: SvgIconComponent;
}

type CustomMenuProps = {
    trigger: React.ReactNode;
    items: Items[];
    onSelect?: (item: Items) => void;
};

export default function CustomMenu({ trigger, items, onSelect }: CustomMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <span onClick={handleClick}>
                {trigger}
            </span>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {items.map((item) => (
                    <MenuItem
                        key={item.id}
                        onClick={() => {
                            onSelect?.(item);
                            handleClose();
                        }}
                        sx={{ display: "flex", gap: 1.5 }}
                    >

                        {item.icon && <item.icon fontSize="small" />}

                        <Typography variant="body2">
                            {item.label}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}