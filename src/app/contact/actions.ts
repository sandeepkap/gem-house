"use server";

import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

export async function submitContact(formData: FormData) {
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const TO = process.env.CONTACT_TO_EMAIL;

    console.log("ENV CHECK:", {
        hasUser: Boolean(GMAIL_USER),
        hasPass: Boolean(GMAIL_APP_PASSWORD),
        to: TO,
    });

    const name = String(formData.get("name") || "").trim();
    const preferred = String(formData.get("preferred") || "email").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !message) redirect("/contact?sent=0&v=1");
    if (preferred === "email" && !email) redirect("/contact?sent=0&v=1");
    if (preferred === "phone" && !phone) redirect("/contact?sent=0&v=1");

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !TO) {
        console.error("MISSING ENV VARS");
        redirect("/contact?sent=0&v=2");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Ceylon Gem Co. Website" <${GMAIL_USER}>`,
            to: TO,
            subject: `New inquiry — ${name}`,
            text: `Name: ${name}\nPreferred: ${preferred}\nEmail: ${email || "-"}\nPhone: ${phone || "-"}\n\n${message}`,
            replyTo: preferred === "email" ? email : undefined,
        });

        console.log("MAIL SENT:", info.response || info);
    } catch (err) {
        console.error("GMAIL SEND FAILED:", err);
        redirect("/contact?sent=0&v=2");
    }

    redirect("/contact?sent=1");
}
