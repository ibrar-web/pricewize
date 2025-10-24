# 🖼️ Image Usage Audit - PriceWize

## Current Status: ⚠️ INCONSISTENCIES FOUND

Your project has image files that are **not being used consistently** across the codebase.

---

## 📁 Images in `/public`

### Files Present:
1. ✅ `pricewize-logo.png` - Logo file
2. ✅ `pricewize-og-image.png` - OG image (PNG format)
3. ✅ `og-image.jpg` - Generated OG image (JPEG format)
4. ❌ `logo.png` - Referenced but doesn't exist

---

## 🔍 Issues Found

### Issue 1: Logo Reference Mismatch ❌
**Location**: `src/components/seo/StructuredData.tsx` (line 28)
```typescript
logo: "https://pricewize-steel.vercel.app/logo.png",
```
**Problem**: References `logo.png` but actual file is `pricewize-logo.png`
**Impact**: Schema validation fails, logo not found

---

### Issue 2: OG Image Format Inconsistency ❌
**Multiple references to different OG image formats:**

#### In `src/app/layout.tsx` (line 43):
```typescript
url: "https://pricewize-steel.vercel.app/og-image.jpg",
```

#### In `src/lib/seo/generateMeta.ts` (lines 34, 54):
```typescript
ogImage: `${SITE_URL}/og-image.png`,
```

**Problem**: 
- `layout.tsx` points to `.jpg` format
- `generateMeta.ts` points to `.png` format
- Both files exist but serve different purposes

**Impact**: Inconsistent social media previews

---

### Issue 3: Logo Not Used in UI ❌
**Location**: `src/components/layout/Header.tsx`
```typescript
<Smartphone size={24} className="text-white" />
```
**Problem**: Using Lucide icon instead of actual logo image
**Impact**: Logo file unused in UI

---

## 📊 Current File Usage

| File | Format | Used In | Status |
|------|--------|---------|--------|
| `pricewize-logo.png` | PNG | Nowhere | ❌ Unused |
| `pricewize-og-image.png` | PNG | Nowhere | ❌ Unused |
| `og-image.jpg` | JPEG | `layout.tsx` | ✅ Used |
| `logo.png` | - | Schema (doesn't exist) | ❌ Missing |

---

## ✅ Recommended Solution

### Option 1: Use Existing PNG Files (Recommended)
**Rename and consolidate:**
1. Rename `pricewize-logo.png` → `logo.png`
2. Rename `pricewize-og-image.png` → `og-image.png`
3. Delete `og-image.jpg` (generated file)
4. Update all references to use `.png` format

**Advantages**:
- Uses your custom images
- Consistent naming
- Single format

### Option 2: Keep Generated JPEG (Current)
**Keep current setup:**
1. Delete `pricewize-logo.png` and `pricewize-og-image.png`
2. Create `logo.png` (or use generated one)
3. Keep `og-image.jpg` for OG
4. Update all references to `.jpg`

**Advantages**:
- Optimized file sizes
- Consistent with generation script
- Cleaner public folder

---

## 🔧 Required Fixes

### Fix 1: Update Logo Reference
**File**: `src/components/seo/StructuredData.tsx`
```typescript
// BEFORE
logo: "https://pricewize-steel.vercel.app/logo.png",

// AFTER (if using pricewize-logo.png)
logo: "https://pricewize-steel.vercel.app/pricewize-logo.png",
```

### Fix 2: Standardize OG Image References
**File**: `src/lib/seo/generateMeta.ts`
```typescript
// BEFORE
ogImage: `${SITE_URL}/og-image.png`,

// AFTER (to match layout.tsx)
ogImage: `${SITE_URL}/og-image.jpg`,
```

### Fix 3: Use Logo in Header (Optional)
**File**: `src/components/layout/Header.tsx`
```typescript
// BEFORE
<Smartphone size={24} className="text-white" />

// AFTER (if you want to use logo image)
<Image 
  src="/pricewize-logo.png" 
  alt="PriceWize Logo" 
  width={32} 
  height={32}
/>
```

---

## 📋 Action Items

### Immediate (Required):
- [ ] Decide: Use PNG or JPEG for OG image
- [ ] Update `src/lib/seo/generateMeta.ts` to match `layout.tsx`
- [ ] Fix logo reference in `StructuredData.tsx`
- [ ] Delete unused image files

### Optional (Enhancement):
- [ ] Use logo image in Header component
- [ ] Optimize image file sizes
- [ ] Add favicon if missing

---

## 🎯 Recommended Implementation

### Step 1: Standardize to JPEG (Recommended)
```bash
# Delete PNG files
rm public/pricewize-logo.png
rm public/pricewize-og-image.png

# Keep og-image.jpg (already optimized)
# Create logo.jpg from og-image.jpg or generate new one
```

### Step 2: Update References
- Update `src/lib/seo/generateMeta.ts` line 34 & 54
- Update `src/components/seo/StructuredData.tsx` line 28

### Step 3: Verify
- Check all metadata references
- Test social media preview
- Verify schema validation

---

## 📊 File Size Comparison

| File | Size | Format | Quality |
|------|------|--------|---------|
| `pricewize-logo.png` | ? | PNG | Unknown |
| `pricewize-og-image.png` | ? | PNG | Unknown |
| `og-image.jpg` | 36KB | JPEG | 90% |

**Recommendation**: JPEG is more optimized for web

---

## ✨ Final Checklist

- [ ] All image references are consistent
- [ ] No broken image links
- [ ] Logo file exists and is referenced correctly
- [ ] OG image format is consistent
- [ ] Unused files are deleted
- [ ] Schema validation passes
- [ ] Social media preview works

---

**Status**: ⚠️ **NEEDS ATTENTION**

Please choose Option 1 or Option 2 above and implement the fixes.

