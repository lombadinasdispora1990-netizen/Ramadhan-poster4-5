# ⚡ Quick Start - Supabase Integration

## 🎯 3-Minute Setup

### Step 1: Run SQL Migration (1 minute)

1. Open https://supabase.com/dashboard
2. Select project: `ceuvbpnozyqhrpjsdnjq`
3. Go to **SQL Editor**
4. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click **Run**

✅ Database tables created!

---

### Step 2: Start Dev Server (1 minute)

```bash
npm run dev
```

Server starts at: `http://localhost:3001`

---

### Step 3: Test Authentication (1 minute)

1. Click **"Get Started"** button
2. Fill registration form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Create Account"**
4. Check email for confirmation link
5. Click confirmation link
6. You're in! 🎉

---

## ✅ Verification Checklist

After setup, verify these work:

### Authentication
- [ ] Can register new account
- [ ] Received confirmation email
- [ ] Can login after confirmation
- [ ] See user email in header
- [ ] Can logout successfully

### Generation
- [ ] Upload a photo
- [ ] Select a mode (e.g., realistic)
- [ ] Click "Generate Poster"
- [ ] Wait for generation
- [ ] Poster appears in preview

### History
- [ ] Scroll down to "Your Generation History"
- [ ] See the generated poster
- [ ] Click download → works
- [ ] Click delete → confirms and removes
- [ ] Refresh page → deletion persists

---

## 🐛 Common Issues

### "Email not confirmed"
- Check spam folder
- Email from: `noreply@ceuvbpnozyqhrpjsdnjq.supabase.co`

### "Table doesn't exist"
- Run SQL migration first (Step 1 above)

### "Generations not saving"
- Check console for errors
- Verify you're logged in (see email in header)

---

## 📱 Quick Test Flow

```
1. Register → Confirm Email → Login
2. Upload Photo → Generate Poster
3. Scroll Down → See in History
4. Download/Delete → Test Actions
5. Logout → Back to Landing Page
```

---

## 🎉 Success!

If all checkboxes above are ✅, you're ready to go!

For detailed documentation, see:
- `SUPABASE_SETUP.md` - Full setup guide
- `SUPABASE_INTEGRATION_SUMMARY.md` - Implementation details

---

<div align="center">

**Happy Testing!** 🌙✨

</div>
