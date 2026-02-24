// src/app/api/custom-jewelry-enquiry/route.ts
// Sends a formatted email via Gmail (nodemailer) with all form fields
// and inspiration images attached directly to the email.
// Install: npm install nodemailer
// Types:   npm install --save-dev @types/nodemailer

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    try {
        const {
            name, email, phone, occasion,
            type, metal, budget, stoneOpt,
            description, imageUrls,
        }: {
            name: string; email: string; phone: string; occasion: string;
            type: string; metal: string; budget: string; stoneOpt: string;
            description: string;
            imageUrls: { url: string; name: string; type: string }[];
        } = await req.json();

        /* ── Build email attachments from base64 data URLs ── */
        const attachments = (imageUrls ?? []).map((img, i) => {
            const base64Data = img.url.split(",")[1]; // strip "data:image/jpeg;base64,"
            const ext = img.type.split("/")[1] || "jpg";
            return {
                filename: img.name || `inspiration-${i + 1}.${ext}`,
                content:  base64Data,
                encoding: "base64" as const,
                contentType: img.type,
            };
        });

        /* ── HTML body for the enquiry email ── */
        const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#111;line-height:1.6">
        <div style="border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:28px">
          <h1 style="font-size:22px;font-weight:400;margin:0">New Custom Jewellery Enquiry</h1>
          <p style="font-size:12px;color:#888;font-family:Arial,sans-serif;margin:6px 0 0">
            Received via ceylongemcompany.com
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;margin-bottom:28px">
          ${row("Name",         name)}
          ${row("Email",        `<a href="mailto:${email}" style="color:#111">${email}</a>`)}
          ${row("Phone",        phone   || "—")}
          ${row("Occasion",     occasion || "—")}
          ${row("Piece type",   type    || "—")}
          ${row("Metal",        metal   || "—")}
          ${row("Budget",       budget  || "—")}
          ${row("Stone",        stoneOpt || "—")}
        </table>

        <h2 style="font-size:13px;font-family:Arial,sans-serif;color:#aaa;letter-spacing:0.08em;text-transform:uppercase;font-weight:400;margin:0 0 10px">
          Their Vision
        </h2>
        <div style="background:#fafafa;border:1px solid #e8e8e8;padding:16px 18px;font-size:15px;line-height:1.75;white-space:pre-wrap;margin-bottom:28px">
          ${description}
        </div>

        ${attachments.length > 0 ? `
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#888;margin:0">
            ${attachments.length} inspiration image${attachments.length > 1 ? "s" : ""} attached to this email.
          </p>
        ` : ""}

        <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8e8e8;font-family:Arial,sans-serif;font-size:11px;color:#bbb">
          Hit Reply to respond directly to ${name} at ${email}
        </div>
      </div>
    `;

        /* ── Send enquiry email to you ── */
        await transporter.sendMail({
            from:        `"Ceylon Gem Co." <${process.env.GMAIL_USER}>`,
            to:          process.env.CONTACT_TO_EMAIL,
            replyTo:     email,
            subject:     `Custom Jewellery Enquiry — ${name}`,
            html,
            attachments,
        });

        /* ── Send confirmation email to the customer ── */
        await transporter.sendMail({
            from:    `"Ceylon Gem Co." <${process.env.GMAIL_USER}>`,
            to:      email,
            subject: "We've received your enquiry — Ceylon Gem Co.",
            html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#111;line-height:1.6">
          <h1 style="font-size:22px;font-weight:400;margin:0 0 18px">
            Thank you, ${name.split(" ")[0]}.
          </h1>
          <p style="font-size:15px;font-family:Arial,sans-serif;color:#555;margin:0 0 14px">
            We've received your custom jewellery enquiry and will be in touch within 24 hours to discuss your piece.
          </p>
          <p style="font-size:14px;font-family:Arial,sans-serif;color:#888;margin:0">
            — The Ceylon Gem Co. team
          </p>
        </div>
      `,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[enquiry]", err);
        return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
}

function row(label: string, value: string) {
    return `
    <tr style="border-bottom:1px solid #f0f0f0">
      <td style="padding:11px 0;color:#aaa;text-transform:uppercase;font-size:10px;letter-spacing:0.08em;width:130px;vertical-align:top;font-family:Arial,sans-serif">
        ${label}
      </td>
      <td style="padding:11px 0;font-size:14px;color:#111">
        ${value}
      </td>
    </tr>`;
}