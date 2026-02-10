"use client";

import ContactFields from "./ContactFields";
import SubmitOverlay from "./SubmitOverlay";

export default function ContactFormClient({
                                              action,
                                              styles,
                                          }: {
    action: (formData: FormData) => void;
    styles: {
        form: React.CSSProperties;
        grid2: React.CSSProperties;
        field: React.CSSProperties;
        label: React.CSSProperties;
        input: React.CSSProperties;
        select: React.CSSProperties;
        textarea: React.CSSProperties;
        buttonRow: React.CSSProperties;
        button: React.CSSProperties;
        note: React.CSSProperties;
        directBox: React.CSSProperties;
        directLink: React.CSSProperties;
    };
}) {
    return (
        <>
            <SubmitOverlay />

            <form
                action={action}
                style={styles.form}
                onSubmit={() => window.dispatchEvent(new Event("cg:submit"))}
            >
                <div style={styles.grid2} className="cg-grid2">
                    <div style={styles.field}>
                        <label style={styles.label}>Name</label>
                        <input name="name" required placeholder="Your name" style={styles.input} />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Direct</label>
                        <div style={styles.directBox}>
                            <a
                                href="mailto:ceylongemcompany.inquiries@gmail.com"
                                style={styles.directLink}
                            >
                                ceylongemcompany.inquiries@gmail.com
                            </a>
                            <a href="tel:+16084212077" style={styles.directLink}>
                                +1 608 421 2077
                            </a>
                        </div>
                    </div>
                </div>

                <ContactFields
                    styles={{
                        grid2: styles.grid2,
                        field: styles.field,
                        label: styles.label,
                        input: styles.input,
                        select: styles.select,
                    }}
                />

                <div style={styles.field}>
                    <label style={styles.label}>Message</label>
                    <textarea
                        name="message"
                        required
                        rows={6}
                        placeholder="Tell us what you’re looking for."
                        style={styles.textarea}
                    />
                </div>

                <div style={styles.buttonRow}>
                    <button type="submit" style={styles.button}>
                        Send Inquiry
                    </button>

                    <div style={styles.note}>
                        Appointments are arranged strictly by prior arrangement.
                    </div>
                </div>
            </form>
        </>
    );
}
