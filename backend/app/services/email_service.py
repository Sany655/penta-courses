import os
import smtplib
import logging
import urllib.request
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from backend.app.core.config import settings

logger = logging.getLogger("penta.email")

class EmailService:
    @staticmethod
    def _render_reset_email_html(user_name: str, reset_url: str) -> str:
        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password — Pentabrid Engine</title>
</head>
<body style="margin: 0; padding: 0; background-color: #05070a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #090d16; border: 1px solid #1e293b; border-radius: 20px; padding: 36px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding-bottom: 24px;">
              <div style="display: inline-block; width: 36px; height: 36px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 10px; text-align: center; line-height: 36px; color: #10b981; font-weight: bold; font-size: 16px;">
                ▲
              </div>
              <span style="font-weight: 800; font-size: 16px; letter-spacing: 0.5px; color: #ffffff; margin-left: 10px; vertical-align: middle;">PENTABRID <span style="color: #10b981;">ENGINE</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 16px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Password Reset Request</h1>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
              Hello <strong style="color: #e2e8f0;">{user_name}</strong>,<br><br>
              We received a request to reset the password for your Pentabrid Engine account. Click the button below to choose a new password. This secure link is valid for <strong>15 minutes</strong>.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <a href="{reset_url}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #022c22; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                RESET PASSWORD →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px; color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #1e293b; padding-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="{reset_url}" style="color: #38bdf8; word-break: break-all; font-family: monospace;">{reset_url}</a>
            </td>
          </tr>
          <tr>
            <td style="color: #475569; font-size: 11px; line-height: 1.4;">
              If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    @staticmethod
    def _render_changed_notification_html(user_name: str) -> str:
        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Security Alert: Password Changed — Pentabrid Engine</title>
</head>
<body style="margin: 0; padding: 0; background-color: #05070a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" style="max-width: 540px; background-color: #090d16; border: 1px solid #1e293b; border-radius: 20px; padding: 36px; text-align: left;">
          <tr>
            <td style="padding-bottom: 20px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">Security Alert: Password Updated</h1>
            </td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
              Hello <strong style="color: #e2e8f0;">{user_name}</strong>,<br><br>
              The password for your Pentabrid Engine account was successfully updated.<br><br>
              If you initiated this change, no further action is required.<br><br>
              <strong style="color: #f43f5e;">If you did NOT make this change</strong>, please contact platform security immediately at <a href="mailto:admin@pentabrid.com" style="color: #38bdf8;">admin@pentabrid.com</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    @classmethod
    def send_email(cls, to_email: str, subject: str, html_content: str) -> bool:
        from_email = os.getenv("EMAIL_FROM", "Pentabrid Security <security@pentabrid.com>")
        resend_api_key = os.getenv("RESEND_API_KEY")
        smtp_host = os.getenv("SMTP_HOST")

        # 1. Resend API Provider
        if resend_api_key:
            try:
                payload = json.dumps({
                    "from": from_email,
                    "to": [to_email],
                    "subject": subject,
                    "html": html_content
                }).encode('utf-8')
                req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=payload,
                    headers={
                        "Authorization": f"Bearer {resend_api_key}",
                        "Content-Type": "application/json",
                        "User-Agent": "PentabridEngine/1.0"
                    }
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    logger.info(f"Email sent via Resend API to {to_email} (status {resp.status})")
                    return True
            except Exception as e:
                logger.error(f"Failed to send email via Resend API to {to_email}: {e}")

        # 2. Standard SMTP Provider
        if smtp_host:
            try:
                import email.utils
                smtp_port = int(os.getenv("SMTP_PORT", "587"))
                smtp_user = os.getenv("SMTP_USER", "").strip()
                smtp_pass = os.getenv("SMTP_PASSWORD", "").replace(" ", "").strip()
                smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

                clean_from = from_email.strip('"').strip("'")
                envelope_sender = email.utils.parseaddr(clean_from)[1] or smtp_user

                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = clean_from
                msg['To'] = to_email
                msg.attach(MIMEText(html_content, 'html'))

                server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
                if smtp_use_tls:
                    server.starttls()
                if smtp_user and smtp_pass:
                    server.login(smtp_user, smtp_pass)
                server.sendmail(envelope_sender, [to_email], msg.as_string())
                server.quit()
                logger.info(f"Email sent via SMTP to {to_email}")
                return True
            except Exception as e:
                logger.error(f"Failed to send email via SMTP to {to_email}: {e}")

        # 3. Dev / Console Fallback Logger
        print(f"\n{'='*60}\n[EMAIL SERVICE DISPATCH]\nTo: {to_email}\nSubject: {subject}\n{'='*60}\n", flush=True)
        logger.info(f"[DEV EMAIL LOG] Dispatched to {to_email}: {subject}")
        return True

    @classmethod
    def send_password_reset_email(cls, to_email: str, user_name: str, reset_url: str) -> bool:
        subject = "Reset Your Password — Pentabrid Engine"
        html = cls._render_reset_email_html(user_name=user_name, reset_url=reset_url)
        return cls.send_email(to_email=to_email, subject=subject, html_content=html)

    @classmethod
    def send_password_changed_notification(cls, to_email: str, user_name: str) -> bool:
        subject = "Security Notice: Password Updated — Pentabrid Engine"
        html = cls._render_changed_notification_html(user_name=user_name)
        return cls.send_email(to_email=to_email, subject=subject, html_content=html)
