"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobApplicationEmailTemplate = void 0;
const getJobApplicationEmailTemplate = (jobPost, applicationData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff; 
        }
        .header { 
          background: #2563eb; 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .content { 
          padding: 30px 20px; 
          background: #f8fafc; 
        }
        .footer { 
          background: #e2e8f0; 
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #64748b; 
        }
        .info-card { 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 15px 0; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
        }
        .label { 
          font-weight: 600; 
          color: #475569; 
          display: inline-block; 
          width: 120px; 
        }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background: #2563eb; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 10px 0; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📨 New Job Application</h1>
          <p>You've received a new application for ${jobPost.title}</p>
        </div>
        
        <div class="content">
          <div class="info-card">
            <h2>📋 Position Details</h2>
            <p><span class="label">Job Title:</span> ${jobPost.title}</p>
            <p><span class="label">Company:</span> ${jobPost.company}</p>
            <p><span class="label">Location:</span> ${jobPost.location}</p>
          </div>
          
          <div class="info-card">
            <h2>👤 Applicant Information</h2>
            <p><span class="label">Name:</span> ${applicationData.applicantName}</p>
            <p><span class="label">Email:</span> ${applicationData.applicantEmail}</p>
            <p><span class="label">Phone:</span> ${applicationData.phone || "Not provided"}</p>
            <p><span class="label">Applied On:</span> ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${applicationData.coverLetter
        ? `
          <div class="info-card">
            <h2>📝 Cover Letter</h2>
            <p>${applicationData.coverLetter}</p>
          </div>
          `
        : ""}
          
          <div class="info-card">
            <h2>📎 Attachment</h2>
            <p>The applicant's resume is attached to this email.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated message from ${jobPost.company} Hiring System.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.getJobApplicationEmailTemplate = getJobApplicationEmailTemplate;
