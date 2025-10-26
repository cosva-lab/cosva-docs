# AWS Cognito Email Delivery Troubleshooting Guide

## Common Reasons Why Emails Don't Arrive

### 1. **AWS SES Configuration Issues**
- **Problem**: AWS Cognito uses Amazon SES to send emails, but SES might not be properly configured
- **Solution**: 
  - Verify your email domain in AWS SES
  - Check if you're in the SES sandbox (can only send to verified emails)
  - Request production access if needed

### 2. **Email Address Not Verified**
- **Problem**: If using SES sandbox, you can only send emails to verified email addresses
- **Solution**: 
  - Go to AWS SES Console
  - Add your test email addresses to verified identities
  - Or request production access

### 3. **Spam/Junk Folder**
- **Problem**: Emails are being sent but end up in spam folder
- **Solution**: 
  - Check spam/junk folder
  - Add sender to contacts
  - Configure SPF, DKIM, and DMARC records

### 4. **User Pool Email Configuration**
- **Problem**: User Pool not configured to send emails
- **Solution**: 
  - Check User Pool settings in AWS Console
  - Ensure "Email" is selected as verification method
  - Verify email configuration

### 5. **Custom Message Trigger Issues**
- **Problem**: Custom message trigger might be blocking emails
- **Solution**: 
  - Check CloudWatch logs for trigger errors
  - Ensure trigger returns proper response format

## Debugging Steps

### Step 1: Check Console Logs
Open browser developer tools and look for:
```javascript
// Registration logs
console.log('Registering user:', email);
console.log('Registration result:', result);

// Forgot password logs  
console.log('Sending forgot password email to:', email);
console.log('Forgot password result:', result);
```

### Step 2: Check AWS CloudWatch Logs
1. Go to AWS CloudWatch Console
2. Look for logs from your User Pool triggers
3. Check for any error messages

### Step 3: Test with Verified Email
1. Go to AWS SES Console
2. Add your test email to verified identities
3. Try sending emails to verified addresses only

### Step 4: Check User Pool Settings
1. Go to AWS Cognito Console
2. Select your User Pool
3. Go to "Sign-up experience" tab
4. Ensure "Email" is selected for verification
5. Check "Message customizations" section

## Quick Fixes

### Fix 1: Update Email Configuration
```typescript
// In amplify/auth/resource.ts
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  email: {
    from: 'noreply@yourdomain.com', // Use verified domain
    replyTo: 'support@yourdomain.com',
  },
});
```

### Fix 2: Add Error Handling
```typescript
// In your auth functions
try {
  const result = await resetPassword({ username: email });
  console.log('Email sent successfully:', result);
} catch (error) {
  console.error('Email sending failed:', error);
  // Handle error appropriately
}
```

### Fix 3: Verify SES Status
```bash
# Check SES sending quota
aws ses get-send-quota

# Check verified identities
aws ses list-verified-email-addresses
```

## Production Setup

### 1. Request SES Production Access
- Go to AWS SES Console
- Request production access
- Provide use case details

### 2. Configure Domain Authentication
- Set up SPF record
- Configure DKIM
- Set up DMARC policy

### 3. Monitor Email Delivery
- Set up CloudWatch alarms
- Monitor bounce and complaint rates
- Track delivery statistics

## Testing Commands

```bash
# Deploy updated auth configuration
npx ampx sandbox

# Check User Pool configuration
aws cognito-idp describe-user-pool --user-pool-id YOUR_POOL_ID

# Test email sending
aws ses send-email --source "test@yourdomain.com" --destination "ToAddresses=test@example.com" --message "Subject={Data='Test'},Body={Text={Data='Test message'}}"
```

## Common Error Messages

- **"Email address not verified"**: Add email to SES verified identities
- **"Sending quota exceeded"**: Check SES sending limits
- **"Invalid email address"**: Verify email format
- **"User not found"**: Ensure user exists in User Pool
- **"Invalid verification code"**: Check code format and expiration

## Next Steps

1. **Deploy the updated configuration**:
   ```bash
   npx ampx sandbox
   ```

2. **Test with verified email addresses**

3. **Check CloudWatch logs for any errors**

4. **Monitor email delivery in SES console**

5. **If still having issues, contact AWS Support**
