// src/app/components/WhatsAppInquireLink.tsx
"use client";

import React from "react";

type Props = {
    inquireHref: string;
    whatsappHref: string;
    style?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
};

export default function WhatsAppInquireLink({
                                                inquireHref,
                                                whatsappHref,
                                                style,
                                                iconStyle,
                                            }: Props) {
    return (
        <a
            href={inquireHref}
            style={style}
            onClick={() => {
                window.open(whatsappHref, "_blank", "noopener,noreferrer");
            }}
        >
            <span style={iconStyle}>→</span>
            Enquire via WhatsApp
        </a>
    );
}