import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType: string;
  }>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@yourcompany.com",
      ...options,
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendJobApplicationEmail = async (
  jobPost: any, // This should be the job post document
  applicationData: any, // This should be the application data
  resumePath: string
): Promise<boolean> => {
  const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    }
    .container {
      max-width: 650px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #4a90e2;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 25px 20px;
      line-height: 1.6;
    }
    .content h3 {
      color: #4a90e2;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .content p {
      margin: 8px 0;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 15px 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .info-table td {
      padding: 8px 5px;
      border-bottom: 1px solid #eee;
    }
    .info-table td.label {
      font-weight: bold;
      width: 120px;
      color: #555;
    }
    @media only screen and (max-width: 600px) {
      .container { margin: 15px; }
      .header h2 { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Job Application Received</h2>
    </div>
    <div class="content">
      <p>Hello Hiring Manager,</p>
      <p>A new application has been received for the position: <strong>${jobPost.title}</strong></p>

      <h3>Applicant Details</h3>
      <table class="info-table">
        <tr>
          <td class="label">Name:</td>
          <td>${applicationData.applicantName}</td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td>${applicationData.applicantEmail}</td>
        </tr>
        <tr>
          <td class="label">Phone:</td>
          <td>${applicationData.phone || "Not provided"}</td>
        </tr>
      </table>

      <h3>Cover Letter</h3>
      <p>${applicationData.coverLetter || "No cover letter provided."}</p>

      <p>Please find the applicant's resume attached for further review.</p>
    </div>
    <div class="footer">
      <p>This is an automated notification. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

  // Get resume filename for attachment
  const resumeFilename = path.basename(resumePath);

  return await sendEmail({
    to: jobPost.contactEmail,
    subject: `New Application for ${jobPost.title} - ${applicationData.applicantName}`,
    html: emailTemplate,
    attachments: [
      {
        filename: `Resume_${applicationData.applicantName}_${resumeFilename}`,
        path: resumePath,
        contentType: "application/pdf",
      },
    ],
  });
};
