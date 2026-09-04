import nodemailer from 'nodemailer';

// Create transporter using environment variables or test account
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'adityam8787@gmail.com',
    pass: process.env.SMTP_PASS || ''
  }
});

export async function sendAppointmentEmail({ to, name, date, time, status, approved_by_email, description }) {
  let subject = '';
  let htmlContent = '';

  const formattedDate = date;
  const formattedTime = time;

  if (status === 'APPROVED') {
    subject = `✅ Appointment Confirmed for ${formattedDate} at ${formattedTime}`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; borderRadius: 16px;">
        <h2 style="color: #38bdf8; margin-top: 0;">Appointment Approved!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are pleased to inform you that your appointment request has been <strong>APPROVED</strong>.</p>
        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;">⏰ <strong>Time:</strong> ${formattedTime}</p>
          <p style="margin: 5px 0;">📝 <strong>Topic:</strong> ${description || 'Consultation'}</p>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you have any questions or need to reschedule, please contact us.</p>
        <hr style="border: 0; border-top: 1px solid #334155; margin-top: 25px;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">Aditya Kumar Mishra Portfolio & Consultation Services</p>
      </div>
    `;
  } else if (status === 'REJECTED') {
    subject = `❌ Appointment Status Update for ${formattedDate}`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; borderRadius: 16px;">
        <h2 style="color: #f43f5e; margin-top: 0;">Appointment Status Update</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out. Unfortunately, your appointment request for <strong>${formattedDate} at ${formattedTime}</strong> could not be approved at this time due to scheduling conflicts.</p>
        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border-left: 4px solid #f43f5e; margin: 20px 0;">
          <p style="margin: 5px 0;">Please feel free to submit another request with an alternative date or time slot.</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #334155; margin-top: 25px;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">Aditya Kumar Mishra Portfolio & Consultation Services</p>
      </div>
    `;
  } else if (status === 'CANCELLED') {
    subject = `⚠️ Appointment Cancelled for ${formattedDate}`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; borderRadius: 16px;">
        <h2 style="color: #fbbf24; margin-top: 0;">Appointment Cancelled</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your appointment scheduled for <strong>${formattedDate} at ${formattedTime}</strong> has been cancelled.</p>
        <p style="color: #94a3b8; font-size: 13px;">If this was a mistake or you wish to book another session, please visit the portfolio booking section.</p>
      </div>
    `;
  } else {
    subject = `📋 Appointment Request Received for ${formattedDate}`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; borderRadius: 16px;">
        <h2 style="color: #38bdf8; margin-top: 0;">Appointment Request Received</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have received your appointment request for <strong>${formattedDate} at ${formattedTime}</strong>. It is currently pending review.</p>
      </div>
    `;
  }

  try {
    if (!process.env.SMTP_PASS) {
      console.log(`[Email Notice] SMTP_PASS not set. Email notification payload prepared for ${to} [Status: ${status}]`);
      return;
    }
    const info = await transporter.sendMail({
      from: '"Aditya Portfolio" <adityam8787@gmail.com>',
      to,
      subject,
      html: htmlContent
    });
    console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
  } catch (err) {
    console.error(`[Email Error] Could not send email to ${to}:`, err.message);
  }
}
