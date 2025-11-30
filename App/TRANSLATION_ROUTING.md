# Translation & Routing Guide

## How It Works

### 1. **Client-Side Translation (No Page Reload)**
✅ **Translation happens instantly without page reload!**

The translation system uses React context and state, so when you change the language:
- The UI updates immediately
- Text translates in real-time
- No page refresh needed
- Smooth, instant experience

### 2. **URL Structure with `[lang]` Folder**

The `[lang]` folder is a **Next.js dynamic route** that creates URLs like:
- `/en/home` - English home page
- `/hi/home` - Hindi home page  
- `/mr/mediscan` - Marathi MediScan page

**You don't need to manually type the language in the URL** - the language switcher handles it automatically!

### 3. **How Language Switching Works**

When you click the language switcher:

1. **Context Updates** → Translation context changes language
2. **URL Updates** → URL changes from `/en/home` to `/hi/home` (or whatever language you chose)
3. **Text Translates** → All text using `useTranslatedText` hook updates instantly
4. **No Reload** → Everything happens client-side, no page refresh!

### 4. **Do You Need the `[lang]` Folder?**

**Short answer: It's optional but recommended**

**Benefits of keeping `[lang]` folder:**
- ✅ Better SEO (search engines see language-specific URLs)
- ✅ Shareable URLs (you can share `/hi/home` and it opens in Hindi)
- ✅ Browser back/forward works correctly
- ✅ Bookmarkable language-specific pages

**If you remove it:**
- Pages would be at `/home`, `/mediscan`, etc.
- Language would only be in context/localStorage
- Still works, but less SEO-friendly

### 5. **Current Setup**

Your app currently:
- ✅ Uses `[lang]` folder for URL structure
- ✅ Language switcher updates both context AND URL
- ✅ Pages sync with route parameter on load
- ✅ Translations happen client-side (no reload)

## Testing

1. Go to `/en/home` (or just `/` which redirects)
2. Click language switcher → Choose Hindi
3. Watch:
   - URL changes to `/hi/home` (no reload!)
   - Text translates instantly
   - Console shows translation logs

## Troubleshooting

**Language not changing?**
- Check browser console for errors
- Check Network tab for `/api/translate` requests
- Verify `LINGODOTDEV_API_KEY` is set in `.env.local`

**URL not updating?**
- Check that language switcher is using `router.push()`
- Verify pathname is being read correctly

**Translations not showing?**
- Make sure components use `useTranslatedText` hook
- Check that TranslationProvider wraps your app
- Look for errors in browser console

