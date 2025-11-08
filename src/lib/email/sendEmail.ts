import nodemailer from 'nodemailer'

export interface EmailOptions {
    to: string | string[]
    subject: string
    text?: string
    html?: string
    from?: string
    cc?: string | string[]
    bcc?: string | string[]
    replyTo?: string
    attachments?: Array<{
        filename: string
        content?: Buffer | string
        path?: string
        contentType?: string
    }>
}

export interface EmailConfig {
    host: string
    port: number
    secure?: boolean
    auth: {
        user: string
        pass: string
    }
}

/**
 * Sends an email using nodemailer
 * @param options - Email options including recipient, subject, and content
 * @param config - Optional SMTP configuration. If not provided, uses environment variables
 * @returns Promise with the email send result
 */
export async function sendEmail(options: EmailOptions, config?: EmailConfig) {
    // Use provided config or fall back to environment variables
    const smtpConfig: EmailConfig = config || {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        // secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
        },
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: smtpConfig.auth,
    })

    // Verify transporter configuration
    try {
        await transporter.verify()
    } catch (error) {
        console.error('SMTP connection error:', error)
        throw new Error('Failed to verify SMTP configuration')
    }

    // Prepare email options
    const mailOptions = {
        from: options.from || process.env.SMTP_FROM || smtpConfig.auth.user,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc
            ? Array.isArray(options.cc)
                ? options.cc.join(', ')
                : options.cc
            : undefined,
        bcc: options.bcc
            ? Array.isArray(options.bcc)
                ? options.bcc.join(', ')
                : options.bcc
            : undefined,
        replyTo: options.replyTo,
        attachments: options.attachments,
    }

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully:', info.messageId)
        return info
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}
