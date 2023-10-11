import { env } from "../config/env";
import { IBookmark } from "../models/Bookmark";

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

export function reminderEmailTemplate(bookmarks: IBookmark[]) {
  const rows = bookmarks
    .map((b, i) => {
      const note = b.note
        ? b.note.slice(0, 100) + (b.note.length > 100 ? "..." : "")
        : "-";

      let priorityColor = "#4caf50";

      if (b.priority === "HIGH") {
        priorityColor = "#e53935";
      } else if (b.priority === "MEDIUM") {
        priorityColor = "#fb8c00";
      }

      return `
        <tr>
          <td style="padding:10px;border:1px solid #eee;text-align:center">
            ${i + 1}
          </td>

          <td style="padding:10px;border:1px solid #eee">
            <a href="${b.url}"
              target="_blank"
              style="color:#e53935;text-decoration:none;font-weight:600">
              ${b.title}
            </a>
          </td>

          <td style="padding:10px;border:1px solid #eee;color:#555">
            ${note}
          </td>

          <td style="
            padding:10px;
            border:1px solid #eee;
            text-align:center;
            font-weight:600;
            color:${priorityColor};
          ">
            ${b.priority}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bookmark+ Reminders</title>
    </head>

    <body style="
      margin:0;
      padding:0;
      background:#f5f5f5;
      font-family:Arial,sans-serif;
    ">

      <div style="
        max-width:700px;
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
            width="42"
            height="42"
            style="margin-bottom:8px"
          />

          <div style="
            color:#ffffff;
            font-size:20px;
            font-weight:bold;
          ">
            Bookmark+ Reminders
          </div>

        </div>


        <div style="padding:30px">

          <p style="color:#555;font-size:14px">
            Time to catch up on these bookmarks you saved:
          </p>


          <div style="overflow-x:auto">

            <table style="
              width:100%;
              border-collapse:collapse;
              margin-top:15px;
              font-size:14px;
            ">

              <thead>
                <tr style="background:#fafafa">

                  <th style="padding:10px;border:1px solid #eee">#</th>
                  <th style="padding:10px;border:1px solid #eee">Title</th>
                  <th style="padding:10px;border:1px solid #eee">Note</th>
                  <th style="padding:10px;border:1px solid #eee">Priority</th>

                </tr>
              </thead>

              <tbody>
                ${rows}
              </tbody>

            </table>

          </div>


          <div style="margin-top:25px;text-align:center">

            <a href="${process.env.APP_PUBLIC_BASE_URL}"
              style="
                background:#e53935;
                color:#fff;
                padding:10px 22px;
                text-decoration:none;
                border-radius:4px;
                font-weight:600;
                display:inline-block;
              "
            >
              Open Bookmark+
            </a>

          </div>


          <p style="
            margin-top:25px;
            font-size:12px;
            color:#777;
            text-align:center;
          ">
            You’re receiving this because reminders are enabled in Bookmark+
          </p>

        </div>

      </div>

    </body>
  </html>
  `;
}

export function passwordChangedEmailTemplate() {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Changed</title>
    </head>

    <body style="
      margin:0;
      padding:0;
      background:#f5f5f5;
      font-family:Arial,sans-serif;
    ">

      <div style="
        max-width:600px;
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
            width="42"
            height="42"
            style="margin-bottom:8px"
          />

          <div style="
            color:#ffffff;
            font-size:20px;
            font-weight:bold;
          ">
            Bookmark+
          </div>

        </div>


        <div style="padding:30px">

          <h3 style="color:#333;margin-top:0">
            Your password was changed
          </h3>

          <p style="color:#555;font-size:14px;line-height:1.6">
            This is a confirmation that your Bookmark+ account password was
            successfully updated.
          </p>

          <p style="color:#555;font-size:14px;line-height:1.6">
            If you made this change, no action is required.
          </p>

          <p style="color:#555;font-size:14px;line-height:1.6">
            If you did not change your password, please reset it immediately
            and contact support.
          </p>


          <div style="margin-top:25px;text-align:center">

            <a href="${process.env.APP_PUBLIC_BASE_URL}/login"
              style="
                background:#e53935;
                color:#fff;
                padding:10px 22px;
                text-decoration:none;
                border-radius:4px;
                font-weight:600;
                display:inline-block;
              "
            >
              Login to Bookmark+
            </a>

          </div>


          <p style="
            margin-top:30px;
            font-size:12px;
            color:#777;
            text-align:center;
          ">
            If this wasn’t you, secure your account immediately.
          </p>

        </div>

      </div>

    </body>
  </html>
  `;
}

export function resetPasswordEmailTemplate(token: string, expiresAt: Date) {
  const link = `${process.env.APP_PUBLIC_BASE_URL}/reset-password?token=${token}&expireAt=${expiresAt}`;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password</title>
    </head>

    <body style="
      margin:0;
      padding:0;
      background:#f5f5f5;
      font-family:Arial,sans-serif;
    ">

      <div style="
        max-width:600px;
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
            width="42"
            height="42"
            style="margin-bottom:8px"
          />

          <div style="
            color:#ffffff;
            font-size:20px;
            font-weight:bold;
          ">
            Bookmark+
          </div>

        </div>


        <div style="padding:30px">

          <h3 style="color:#333;margin-top:0">
            Reset your password
          </h3>

          <p style="color:#555;font-size:14px;line-height:1.6">
            We received a request to reset your Bookmark+ account password.
          </p>

          <p style="color:#555;font-size:14px;line-height:1.6">
            Click the button below to set a new password. This link is valid for 5 minutes.
          </p>


          <div style="margin-top:25px;text-align:center">

            <a href="${link}"
              style="
                background:#e53935;
                color:#fff;
                padding:10px 22px;
                text-decoration:none;
                border-radius:4px;
                font-weight:600;
                display:inline-block;
              "
            >
              Reset Password
            </a>

          </div>


          <p style="
            margin-top:25px;
            font-size:12px;
            color:#777;
            text-align:center;
          ">
            If you did not request this, you can safely ignore this email.
          </p>

        </div>

      </div>

    </body>
  </html>
  `;
}
