"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpTemplate = void 0;
const otpTemplate = (otp, username) => `
<div style="font-family: 'Segoe UI', sans-serif; background-color: #ecfdf5; padding: 40px 20px; color: #064e3b;">
  <div style="max-width: 500px; margin: auto; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.15); padding: 40px;">
    
    <h2 style="color: #059669; text-align: center; margin-bottom: 20px;">🛡️ Hector Security</h2>
    
    <p style="font-size: 16px; font-weight: 600;">Hi ${username || "there"},</p>
    
    <p style="font-size: 15px; line-height: 1.6; color: #065f46;">
      Someone is attempting to verify this email address for <strong>Hector</strong>. If this wasn't you, please ignore this email.
    </p>

    <div style="text-align: center; margin: 30px 0; background: rgba(5, 150, 105, 0.1); padding: 20px; border-radius: 12px; border: 1px dashed #059669;">
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #059669;">
        ${otp}
      </div>
    </div>

    <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #d97706; padding: 10px 15px; border-radius: 4px; margin-bottom: 20px;">
      <p style="font-size: 13px; color: #92400e; margin: 0;">
        <strong>⚠️ Security Warning:</strong> This code expires in <strong>5 minutes</strong>. Never share this code with anyone, including Hector staff. We will never call or message you asking for this OTP.
      </p>
    </div>

    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
      &copy; ${new Date().getFullYear()} Hector. All rights reserved.
    </p>
  </div>
</div>
`;
exports.otpTemplate = otpTemplate;
