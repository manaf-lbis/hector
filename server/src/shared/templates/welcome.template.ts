export const welcomeTemplate = (username: string) => `
<div style="font-family: 'Segoe UI', sans-serif; background-color: #ecfdf5; padding: 40px 20px; color: #064e3b;">
  <div style="max-width: 500px; margin: auto; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.15); padding: 40px;">
    
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #059669; margin: 0;">Welcome to Hector</h1>
      <p style="font-size: 18px; color: #047857; margin-top: 5px;">We’re thrilled to have you!</p>
    </div>
    
    <p style="font-size: 16px; color: #065f46;">
      Hi ${username},
    </p>
    
    <p style="font-size: 15px; line-height: 1.6; color: #065f46;">
      Your account has been successfully verified, and you are all set to start your journey with us. At <strong>Hector</strong>, we prioritize your experience and security above all else.
    </p>

    <div style="text-align: center; margin: 35px 0;">
      <a href="https://your-app-link.com/dashboard" style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">
        Get Started
      </a>
    </div>

    <p style="font-size: 14px; color: #065f46; text-align: center;">
      Need help? Reply to this email or visit our <a href="#" style="color: #059669;">Help Center</a>.
    </p>

    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px;">
      &copy; ${new Date().getFullYear()} Hector. All rights reserved.
    </p>
  </div>
</div>
`;