import { env } from "../config/env";

export function verificationEmailTemplate(token: string) {
  const verifyUrl = `${env.APP_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Email</title>
    </head>

    <body style="
      margin:0;
      padding:0;
      background:#f5f5f5;
      font-family:Arial, sans-serif;
    ">

      <div style="
        max-width:500px;
        margin:40px auto;
        background:#ffffff;
        border-radius:8px;
        overflow:hidden;
        box-shadow:0 2px 8px rgba(0,0,0,0.1);
      ">

        <div style="
          background:#e53935;
          padding:20px;
          text-align:center;
        ">
          <img
            src="https://i.ibb.co/WvB3fF1d/icon.png"
            alt="Bookmark+"
            width="48"
            height="48"
          />
        </div>

        <div style="padding:30px">

          <h2 style="margin-top:0;color:#222">
            Verify your email
          </h2>

          <p style="color:#555;font-size:14px;line-height:1.6">
            Thanks for joining Bookmark+ 🎉 
            Click the button below to verify your email.
          </p>

          <div style="text-align:center;margin:30px 0">

            <a href="${verifyUrl}"
              style="
                background:#e53935;
                color:#fff;
                padding:12px 24px;
                text-decoration:none;
                border-radius:4px;
                font-weight:bold;
                display:inline-block;
              "
            >
              Verify Email
            </a>

          </div>

          <p style="color:#777;font-size:12px">
            This link will expire in 5 minutes.
            If you didn’t request this, you can ignore this email.
          </p>

        </div>

      </div>

    </body>
  </html>
  `;
}
