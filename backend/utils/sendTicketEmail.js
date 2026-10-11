const nodemailer = require("nodemailer");

// ─── Ticket Confirmation Email ─────────────────────────────────────────────────
// Jab user ticket purchase ya free registration kare, yeh function email bhejta hai.
// Email mein ticket details + event info hoti hai.
//
// Note: Agar EMAIL_USER ya EMAIL_PASS .env mein set nahi hain toh silently fail hoga
// (email nahi jaayegi lekin ticket purchase process block nahi hogi)

const sendTicketEmail = async ({ to, userName, eventTitle, eventDate, venue, ticketType, quantity, totalAmount, isFree, ticketId }) => {
  // Email config missing ho toh skip karo — ticket process block nahi honi chahiye
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Ticket email skipped: EMAIL_USER or EMAIL_PASS not set in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const priceDisplay = isFree ? "Free" : `$${totalAmount.toFixed(2)}`;
  const subject = isFree
    ? `✅ Registration Confirmed — ${eventTitle}`
    : `🎟️ Ticket Confirmed — ${eventTitle}`;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #FDF6EC; border-radius: 12px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #3d1823; font-size: 24px; margin: 0; letter-spacing: 0.05em;">LuxeEvents</h1>
        <p style="color: #8b2d3a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin: 4px 0 0;">
          ${isFree ? "Registration Confirmed" : "Ticket Confirmed"}
        </p>
      </div>

      <!-- Greeting -->
      <p style="color: #6b4c3b; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        Dear <strong>${userName}</strong>, your ${isFree ? "registration" : "ticket purchase"} for 
        <strong>${eventTitle}</strong> has been confirmed!
      </p>

      <!-- Ticket Details Box -->
      <div style="background: #fff; border: 1px solid #e8d5c4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #2d1a0e; font-size: 18px; margin: 0 0 16px; border-bottom: 1px solid #f0e0d0; padding-bottom: 12px;">
          Ticket Details
        </h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #9a8a8a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0;">Event</td>
            <td style="color: #2d1a0e; font-size: 14px; font-weight: bold; text-align: right; padding: 6px 0;">${eventTitle}</td>
          </tr>
          <tr>
            <td style="color: #9a8a8a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0;">Date</td>
            <td style="color: #2d1a0e; font-size: 14px; text-align: right; padding: 6px 0;">${eventDate || "TBA"}</td>
          </tr>
          <tr>
            <td style="color: #9a8a8a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0;">Venue</td>
            <td style="color: #2d1a0e; font-size: 14px; text-align: right; padding: 6px 0;">${venue || "TBA"}</td>
          </tr>
          <tr>
            <td style="color: #9a8a8a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0;">Ticket Type</td>
            <td style="color: #2d1a0e; font-size: 14px; text-align: right; padding: 6px 0;">${ticketType}</td>
          </tr>
          <tr>
            <td style="color: #9a8a8a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 0;">Quantity</td>
            <td style="color: #2d1a0e; font-size: 14px; text-align: right; padding: 6px 0;">${quantity}</td>
          </tr>
          <tr style="border-top: 1px solid #f0e0d0;">
            <td style="color: #3d1823; font-size: 13px; font-weight: bold; text-transform: uppercase; padding: 10px 0 4px;">Total Paid</td>
            <td style="color: #3d1823; font-size: 16px; font-weight: bold; text-align: right; padding: 10px 0 4px;">${priceDisplay}</td>
          </tr>
        </table>
      </div>

      <!-- Ticket ID -->
      <div style="background: #3d1823; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
        <p style="color: #d4a853; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 4px;">Ticket Reference</p>
        <p style="color: #FDF6EC; font-size: 13px; font-family: monospace; letter-spacing: 0.1em; margin: 0;">${ticketId}</p>
      </div>

      <!-- Footer -->
      <p style="color: #9a8a8a; font-size: 11px; text-align: center; line-height: 1.6;">
        Please bring this confirmation to the event. For support, reply to this email.<br>
        <strong style="color: #6b4c3b;">LuxeEvents</strong> — Premium Event Experiences
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"LuxeEvents" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Ticket confirmation email sent to ${to}`);
  } catch (err) {
    // Email fail hone pe silently log karo — purchase block nahi honi chahiye
    console.error("Failed to send ticket confirmation email:", err.message);
  }
};

module.exports = { sendTicketEmail };
