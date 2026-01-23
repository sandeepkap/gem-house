"use client";

import React from "react";

type Props = {
    inquireHref: string;   // current tab (conversion page)
    whatsappHref: string;  // new tab (WhatsApp)
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
                // Must be triggered by the user's click to avoid popup blockers
                window.open(whatsappHref, "_blank", "noopener,noreferrer");
                // Do NOT preventDefault; current tab navigates to inquireHref for tracking
            }}
        >
            <span style={iconStyle}>→</span>
            WhatsApp Inquiry
        </a>
    );
}
