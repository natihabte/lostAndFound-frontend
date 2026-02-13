# Email Verification

Email verification is a crucial security feature that ensures users have access to the email address they provide during registration.

## Why Email Verification?

### Security Benefits

- **Prevent fake accounts**: Ensures real email addresses
- **Account recovery**: Enables password reset functionality
- **Spam prevention**: Reduces automated bot registrations
- **Communication channel**: Verifies notification delivery
- **Identity verification**: Confirms user identity

### User Benefits

- **Account security**: Protects your account
- **Important notifications**: Receive claim updates
- **Password recovery**: Reset forgotten passwords
- **Trust building**: Verified users are more trusted
- **Full access**: Unlock all platform features

## Verification Process

### During Registration

1. **Complete registration form**
   - Provide valid email address
   - Create strong password
   - Fill in required information

2. **Submit registration**
   - Account created in pending state
   - Verification email sent automatically
   - Confirmation message displayed

3. **Check your email**
   - Email arrives within minutes
   - Check spam/junk folder if not received
   - Email contains verification link

4. **Click verification link**
   - Opens verification page
   - Account activated automatically
   - Redirected to login or dashboard

5. **Start using platform**
   - Full access granted
   - All features available
   - Can report items and submit claims

### Verification Email Content

The verification email includes:

**Subject**: "Verify Your Email - Public Sector Lost & Found"

**Content**:
```
Hello [Name],

Welcome to Public Sector Lost & Found!

Please verify your email address by clicking the link below:

[Verify Email Button]

Or copy and paste this link into your browser:
https://platform.com/verify-email?token=abc123...

This link expires in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
Public Sector Lost & Found Team
```

## Verification Link

### Link Structure

```
https://platform.com/verify-email?token=VERIFICATION_TOKEN
```

### Token Properties

- **Unique**: One-time use token
- **Secure**: Cryptographically generated
- **Time-limited**: Expires in 24 hours
- **User-specific**: Tied to your account
- **Single-use**: Cannot be reused

### Link Expiration

If link expires:
1. Request new verification email
2. Check email for new link
3. Click new link within 24 hours
4. Account verified successfully

## Resending Verification Email

### When to Resend

- Email not received after 10 minutes
- Verification link expired
- Email accidentally deleted
- Changed email address

### How to Resend

**Method 1: Login Page**
1. Go to login page
2. Click "Resend Verification Email"
3. Enter your email address
4. Check email for new link

**Method 2: Profile Settings**
1. Login with unverified account (limited access)
2. Navigate to Settings
3. Click "Resend Verification Email"
4. Check email inbox

**Method 3: Contact Support**
1. Use contact form
2. Provide registered email
3. Request verification email resend
4. Support team sends new link

## Troubleshooting

### Email Not Received

**Check Spam/Junk Folder**
- Verification emails may be filtered
- Mark as "Not Spam" if found
- Add sender to contacts

**Verify Email Address**
- Ensure correct email during registration
- Check for typos
- Update email if incorrect

**Email Provider Issues**
- Some providers block automated emails
- Try different email provider
- Contact your email administrator

**Wait and Retry**
- Email may be delayed
- Wait 10-15 minutes
- Request resend if still not received

### Link Not Working

**Link Expired**
- Request new verification email
- Use new link within 24 hours

**Link Already Used**
- Account may already be verified
- Try logging in
- Check account status

**Browser Issues**
- Try different browser
- Clear browser cache
- Disable browser extensions
- Use incognito/private mode

**Copy-Paste Errors**
- Ensure entire link is copied
- No extra spaces or characters
- Try clicking link instead

### Account Still Not Verified

**Check Account Status**
1. Login to account
2. Check profile settings
3. Look for verification status
4. Contact support if issues persist

**Manual Verification**
- Contact administrator
- Provide account details
- Request manual verification
- Admin can verify account

## Email Change

### Changing Email Address

If you need to change your email:

1. **Login to account**
2. **Navigate to Settings → Email**
3. **Enter new email address**
4. **Verify current password**
5. **Submit change request**
6. **Verify new email**
   - Verification email sent to new address
   - Click verification link
   - New email activated

### Important Notes

- Old email remains active until new email verified
- Notifications sent to old email during transition
- New email must be unique (not used by another account)
- Verification required for new email

## Security Considerations

### Protecting Your Email

- **Use strong password**: Secure your email account
- **Enable 2FA**: Two-factor authentication on email
- **Don't share**: Keep verification links private
- **Monitor access**: Check for unauthorized logins
- **Update regularly**: Keep email password current

### Suspicious Emails

Be cautious of:
- Emails asking for password
- Links to unfamiliar domains
- Requests for personal information
- Urgent or threatening language
- Poor grammar or spelling

**Verify Legitimate Emails**:
- Check sender address
- Hover over links before clicking
- Look for official branding
- Contact support if unsure

## Email Verification API

### For Developers

**Send Verification Email**:
```http
POST /api/auth/send-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Verify Email**:
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token"
}
```

**Check Verification Status**:
```http
GET /api/users/verification-status
Authorization: Bearer <jwt_token>
```

## Best Practices

### For Users

1. **Use reliable email**: Choose stable email provider
2. **Check regularly**: Monitor inbox for verification
3. **Act quickly**: Verify within 24 hours
4. **Keep secure**: Protect email account
5. **Update promptly**: Change email if needed

### For Organizations

1. **Require verification**: Enforce for all users
2. **Monitor rates**: Track verification success
3. **Provide support**: Help users with issues
4. **Clear communication**: Explain importance
5. **Flexible timing**: Allow reasonable verification window

## Frequently Asked Questions

**Do I need to verify my email?**
Yes, email verification is required for full platform access.

**How long does verification take?**
Email typically arrives within 5 minutes. Verification is instant after clicking link.

**Can I use the platform without verification?**
Limited access only. Full features require verification.

**What if I don't have access to my email?**
Contact support to update email address or request manual verification.

**Can I change my email later?**
Yes, through Settings. New email requires verification.

**Is my email shared with others?**
No, email addresses are kept private and not shared.

**How many times can I resend verification?**
Unlimited, but wait 5 minutes between requests.

**What happens if I ignore verification?**
Account remains in pending state with limited access.

## Support

Need help with email verification?

- **Help Center**: Search verification articles
- **Contact Form**: Submit support request
- **Email Support**: support@platform.com
- **Live Chat**: Available during business hours
- **Phone Support**: For urgent issues

Email verification ensures a secure, trustworthy platform for all users while enabling important communication features.