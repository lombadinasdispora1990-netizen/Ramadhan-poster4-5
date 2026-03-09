# 🔐 Supabase Integration Setup Guide - BarokahGen

## ✅ Installation Complete!

Your BarokahGen app now has full user authentication and generation history saved to Supabase!

---

## 🚀 Quick Start

### Step 1: Database Setup (IMPORTANT!)

You need to run the SQL migration in your Supabase dashboard:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `ceuvbpnozyqhrpjsdnjq`
3. **Navigate to SQL Editor**
4. **Copy and paste** the contents of `supabase/migrations/001_initial_schema.sql`
5. **Click "Run"** to execute the migration

This will create:
- `profiles` table (user profiles)
- `generations` table (poster history)
- Row Level Security policies
- Auto-create profile trigger

---

### Step 2: Environment Variables

Your `.env` file has been updated with Supabase credentials:

```env
VITE_SUPABASE_URL=https://ceuvbpnozyqhrpjsdnjq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Already configured!

---

### Step 3: Install Dependencies

Already done! Supabase client is installed:

```bash
npm install @supabase/supabase-js
```

---

### Step 4: Run the App

```bash
npm run dev
```

The app will open at `http://localhost:3001`

---

## 🎯 How It Works

### Authentication Flow

1. **User visits site** → Sees landing page
2. **Clicks "Get Started"** → Auth modal opens
3. **Registers/Login** → Supabase handles authentication
4. **Email confirmation** → User clicks confirmation link
5. **Logged in** → Access to poster generation
6. **Generations auto-saved** → Saved to database with user ID

### Generation Saving

When a logged-in user generates a poster:
1. AI generates text + transforms image
2. Data is automatically saved to `generations` table
3. Shows in user's history gallery
4. User can download or delete anytime

---

## 📁 New Files Created

### Components
- `src/components/auth/LoginForm.jsx` - Login form
- `src/components/auth/RegisterForm.jsx` - Registration form
- `src/components/auth/AuthModal.jsx` - Modal wrapper
- `src/components/history/HistoryGallery.jsx` - User's generations

### Context & Utils
- `src/context/AuthContext.jsx` - Authentication state provider
- `src/utils/supabase.js` - Supabase client + helper functions

### Database
- `supabase/migrations/001_initial_schema.sql` - Database schema

### Updated Files
- `src/App.jsx` - Added auth wrapper + landing page
- `src/components/Header.jsx` - Added user menu + login button
- `src/components/ActionButtons.jsx` - Auto-save generations
- `src/utils/api.js` - Added save/delete functions
- `.env` - Added Supabase credentials

---

## 🔑 Features

### ✅ User Authentication
- Email/password signup
- Email confirmation required
- Secure login/logout
- Session persistence
- Auto-refresh tokens

### ✅ User Profiles
- Auto-created on signup
- Stores email + full name
- Linked to auth.users table

### ✅ Generation History
- Auto-saved on generation
- User-specific (RLS protected)
- Shows mode, style, timestamp
- Download/delete functionality
- 50 most recent generations

### ✅ Security
- Row Level Security (RLS) enabled
- Users can only see their own data
- Cascade delete on user removal
- Secure API keys (client-side anon key only)

---

## 🧪 Testing Checklist

### Registration Flow
- [ ] Click "Get Started" button
- [ ] Fill registration form (name, email, password)
- [ ] Check email for confirmation link
- [ ] Click confirmation link
- [ ] Should be redirected back to app
- [ ] Should see user menu in header

### Login Flow
- [ ] Click "Sign In" button
- [ ] Enter email + password
- [ ] Should log in successfully
- [ ] Should see main app interface

### Generation Saving
- [ ] Generate a poster while logged in
- [ ] Check console for "💾 Saving generation..." message
- [ ] Check console for "✅ Generation saved successfully!"
- [ ] Scroll down to "Your Generation History"
- [ ] Should see the generated poster in gallery

### History Gallery
- [ ] View generation in gallery
- [ ] Click download button → Should download image
- [ ] Click delete button → Should confirm then remove
- [ ] Refresh page → Changes should persist

### Logout
- [ ] Click "Logout" button in header
- [ ] Should return to landing page
- [ ] Cannot access generation features
- [ ] Can login again

---

## 🐛 Troubleshooting

### Issue: "Email not confirmed"

**Solution:**
- Check spam folder for confirmation email
- Supabase sends from `noreply@ceuvbpnozyqhrpjsdnjq.supabase.co`
- Can resend confirmation from login screen

### Issue: Generations not saving

**Check:**
1. Console for error messages
2. User is logged in (check header for email)
3. Database table exists in Supabase dashboard
4. RLS policies are enabled

**Solution:**
```sql
-- Check if table exists
SELECT * FROM generations LIMIT 1;

-- Check RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Issue: Can't see history gallery

**Possible causes:**
- Not scrolled down (it's below the generator)
- No generations yet (create one first)
- Not logged in (check header)

---

## 📊 Database Schema

### profiles table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users |
| email | TEXT | User's email (unique) |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | Profile picture URL |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last profile update |

### generations table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique generation ID |
| user_id | UUID | References profiles |
| original_image_url | TEXT | Original uploaded photo |
| transformed_image_url | TEXT | AI-transformed image |
| uploaded_image2_url | TEXT | Second reference photo |
| user_name | TEXT | Sender name entered |
| greeting_type | TEXT | Style (formal, funny, etc.) |
| generation_mode | TEXT | Mode (realistic, 3d, etc.) |
| generated_text | TEXT | AI-generated greeting |
| poster_image_url | TEXT | Final poster (base64) |
| created_at | TIMESTAMP | Generation timestamp |
| download_count | INTEGER | Number of downloads |

---

## 🔧 Customization

### Change Email Template

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Customize the confirmation email template
4. Add your branding/logo

### Adjust Save Behavior

Edit `src/components/ActionButtons.jsx`:

```javascript
// Change what gets saved
await saveGenerationToDB({
  originalImage: uploadedImage,
  // ... modify fields as needed
});
```

### Increase History Limit

Edit `src/components/history/HistoryGallery.jsx`:

```javascript
// Change from 50 to desired number
const { data, error } = await getUserGenerations(user.id, 100);
```

---

## 📈 Next Steps

### Phase 1 (Done)
- ✅ User authentication
- ✅ Auto-save generations
- ✅ History gallery

### Phase 2 (Optional Enhancements)
- [ ] Image upload to Supabase Storage
- [ ] Social authentication (Google, GitHub)
- [ ] Forgot password flow
- [ ] Profile editing
- [ ] Public gallery (opt-in)
- [ ] Generation statistics dashboard

### Phase 3 (Advanced)
- [ ] Batch generation
- [ ] Favorite/save for later
- [ ] Share to social media
- [ ] Email notifications
- [ ] Premium features (paid tier)

---

## 💡 Tips

1. **Test with multiple accounts** - Create 2-3 test users to verify isolation
2. **Monitor database usage** - Check Supabase dashboard for row counts
3. **Backup regularly** - Export database periodically
4. **Rate limiting** - Consider adding limits to prevent abuse
5. **Image optimization** - Compress images before saving to reduce storage

---

## 🆘 Support

If you encounter issues:

1. **Check console logs** - Most errors are logged with helpful messages
2. **Verify database setup** - Make sure SQL migration ran successfully
3. **Test authentication** - Try logging in/out multiple times
4. **Check RLS policies** - Ensure users can only see their own data
5. **Review Supabase docs** - https://supabase.com/docs

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Users can register with email/password  
✅ Confirmation emails are received  
✅ Users can login after confirmation  
✅ Generated posters appear in history gallery  
✅ Delete/remove works correctly  
✅ Logout returns to landing page  
✅ Session persists on page refresh  

---

<div align="center">

**🌙 Happy Generating!**

*May this bring blessings to your Ramadan app*

✨🔐💾

</div>
