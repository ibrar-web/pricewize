# 🚀 Compare Feature - Quick Reference

## 📍 Where to Find Compare

### Device Details Page
- **URL**: `http://localhost:3000/devices/[model]`
- **Example**: `http://localhost:3000/devices/iphone-14-pro`
- **Button**: "Add to Compare" (or "✓ In Compare (X)" if already added)

### Compare Page
- **URL**: `http://localhost:3000/compare`
- **Shows**: Side-by-side comparison of all selected devices
- **Features**: Statistics, comparison table, individual details

---

## 🎯 How to Use

### Add Device to Compare
```
1. Go to /devices
2. Click on a device (e.g., iPhone 14 Pro)
3. Click "Add to Compare" button
4. Button changes to "✓ In Compare (1)"
```

### View Comparison
```
1. Add at least 2 devices
2. Click "View Comparison (2)" button
3. Or go directly to /compare
4. See side-by-side comparison
```

### Add More Devices
```
Option A (From Device Page):
  1. Go to /devices
  2. Click another device
  3. Click "Add to Compare"
  4. Go back to /compare
  5. Comparison updates

Option B (From Compare Page):
  1. On /compare page
  2. Click "Browse More Devices"
  3. Click device
  4. Click "Add to Compare"
  5. Go back to /compare
  6. Comparison updates
```

### Remove Device
```
1. Go to /compare
2. Click trash icon next to device
3. Device removed
4. Comparison updates
```

---

## 🔢 Limits

- **Maximum devices**: 5
- **Minimum to compare**: 2
- **Duplicate devices**: Not allowed
- **Data storage**: localStorage (persists across sessions)

---

## 📱 UI Elements

### Add to Compare Button
- **Location**: Device details page
- **States**:
  - "Add to Compare" (not selected)
  - "✓ In Compare (X)" (selected)
  - "View Comparison (X)" (when 2+ devices)

### Compare Page
- **Empty state**: Shows message to add devices
- **With devices**: Shows comparison table and statistics
- **Add more**: "Browse More Devices" button

---

## 🧪 Test Scenarios

### Scenario 1: Basic Compare
```
1. /devices → iPhone 14 Pro → Add to Compare
2. /devices → Samsung Galaxy S24 → Add to Compare
3. /compare → See comparison
✅ Works!
```

### Scenario 2: Add More
```
1. /devices → iPhone 14 Pro → Add to Compare
2. /devices → Samsung Galaxy S24 → Add to Compare
3. /compare → Browse More Devices
4. /devices → MacBook Pro 16 → Add to Compare
5. /compare → See 3 devices
✅ Works!
```

### Scenario 3: Remove Device
```
1. /compare (with 3 devices)
2. Click trash icon on Samsung Galaxy S24
3. See 2 devices remaining
✅ Works!
```

### Scenario 4: Persistence
```
1. /devices → iPhone 14 Pro → Add to Compare
2. /devices → Samsung Galaxy S24 → Add to Compare
3. Refresh page
4. /compare → Still see 2 devices
✅ Works!
```

---

## 🔗 Available Devices

| Device | URL |
|--------|-----|
| iPhone 14 Pro | `/devices/iphone-14-pro` |
| iPhone 15 Pro Max | `/devices/iphone-15-pro-max` |
| Samsung Galaxy S24 | `/devices/samsung-galaxy-s24` |
| MacBook Pro 16 | `/devices/macbook-pro-16` |
| Dell XPS 13 | `/devices/dell-xps-13` |
| iPad Pro 12.9 | `/devices/ipad-pro-12-9` |
| Samsung Galaxy Tab S9 | `/devices/samsung-galaxy-tab-s9` |
| Google Pixel 8 | `/devices/google-pixel-8` |
| OnePlus 12 | `/devices/oneplus-12` |

---

## 💾 Data Storage

- **Key**: `pricewize_compare_devices`
- **Location**: Browser localStorage
- **Persists**: Across page refreshes and browser sessions
- **Format**: JSON array of device objects

---

## 🐛 Troubleshooting

### Button not showing?
- Make sure you're on a device details page
- Check URL: `/devices/[model]`

### Comparison not showing?
- Add at least 2 devices
- Check localStorage is enabled
- Try refreshing page

### Devices not persisting?
- Check if localStorage is enabled
- Check browser privacy settings
- Try clearing cache and adding again

### Can't add more than 5?
- This is by design (maximum 5 devices)
- Remove a device first to add another

---

## 📊 What You See in Comparison

### Overall Statistics
- Lowest Price
- Highest Price
- Average Price
- Total Listings

### Comparison Table
- Device names
- Prices by platform
- Conditions
- Locations
- Seller names

### Individual Details
- Device image
- Full specifications
- All price listings
- Platform details

---

## ✨ Features

✅ Add devices from device details page
✅ View side-by-side comparison
✅ Add more devices from compare page
✅ Remove devices
✅ Data persists in localStorage
✅ Maximum 5 devices
✅ No duplicate devices
✅ Clear error messages
✅ Responsive design
✅ Mobile friendly

---

## 🚀 Quick Start

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000/devices

# Click on a device
# Click "Add to Compare"
# Add another device
# Click "View Comparison"
# See the comparison!
```

---

## 📞 Need Help?

See `COMPARE_FEATURE_REDESIGNED.md` for detailed documentation.

---

**Status**: ✅ Compare feature fully working!


