# 🎨 Compare Feature - UI Guide

## 📱 Device Details Page UI

### Before Adding to Compare
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  iPhone 14 Pro - Price Comparison                      │
│  Compare 3 listings from multiple platforms            │
│                                                         │
│  [Add to Compare] ← Click this button                  │
│                                                         │
│  Price Listings                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ OLX                                             │   │
│  │ ₨65,000 | Excellent | Karachi                  │   │
│  │ Tech Store                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Cashify                                         │   │
│  │ ₨62,500 | Good | Lahore                        │   │
│  │ Cashify Store                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ eBay                                            │   │
│  │ $250 | Like New | USA                          │   │
│  │ International Seller                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### After Adding to Compare (1 device)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  iPhone 14 Pro - Price Comparison                      │
│  Compare 3 listings from multiple platforms            │
│                                                         │
│  [✓ In Compare (1)]                                    │
│                                                         │
│  Price Listings                                         │
│  ... (same as above)                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### After Adding 2 Devices
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  iPhone 14 Pro - Price Comparison                      │
│  Compare 3 listings from multiple platforms            │
│                                                         │
│  [✓ In Compare (2)]  [View Comparison (2)] ← Click!   │
│                                                         │
│  Price Listings                                         │
│  ... (same as above)                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Compare Page UI

### When No Devices Added
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Device Comparison                                      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  Add at least 2 devices to compare               │ │
│  │                                                   │ │
│  │  Go to a device page and click                   │ │
│  │  'Add to Compare' to get started                 │ │
│  │                                                   │ │
│  │  [Browse Devices →]                             │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### When 1 Device Added
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Device Comparison                                      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  Add at least 2 devices to compare               │ │
│  │                                                   │ │
│  │  Add 1 more device to compare                    │ │
│  │                                                   │ │
│  │  Devices added:                                  │ │
│  │  • iPhone 14 Pro                                 │ │
│  │                                                   │ │
│  │  [Browse Devices →]                             │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### When 2+ Devices Added
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Device Comparison                                      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 💡 Add More Devices                              │ │
│  │ You can compare up to 5 devices.                 │ │
│  │ [Browse More Devices]                           │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Overall Statistics                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Lowest Price: ₨62,500                            │ │
│  │ Highest Price: ₨75,000                           │ │
│  │ Average Price: ₨68,750                           │ │
│  │ Total Listings: 6                                │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Device Comparison Table                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Device          │ Lowest Price │ Avg Price       │ │
│  ├─────────────────┼──────────────┼─────────────────┤ │
│  │ iPhone 14 Pro   │ ₨62,500      │ ₨65,000         │ │
│  │ Samsung S24     │ ₨75,000      │ ₨72,500         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Individual Device Details                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ iPhone 14 Pro                                    │ │
│  │ [Image]                                          │ │
│  │ Lowest: ₨62,500 | Highest: ₨65,000             │ │
│  │ 3 listings from OLX, Cashify, eBay              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Samsung Galaxy S24                               │ │
│  │ [Image]                                          │ │
│  │ Lowest: ₨75,000 | Highest: ₨80,000             │ │
│  │ 3 listings from OLX, Cashify, eBay              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Button States

### Add to Compare Button

#### State 1: Not Added
```
┌──────────────────────┐
│ ➕ Add to Compare    │
└──────────────────────┘
Color: Blue (#2563EB)
Hover: Darker Blue
```

#### State 2: Added (1 device)
```
┌──────────────────────┐
│ ✓ In Compare (1)     │
└──────────────────────┘
Color: Green (#16A34A)
Hover: Darker Green
```

#### State 3: Added (2+ devices)
```
┌──────────────────────┐
│ ✓ In Compare (2)     │
└──────────────────────┘
Color: Green (#16A34A)
Hover: Darker Green

┌──────────────────────────────┐
│ 👁️ View Comparison (2)       │
└──────────────────────────────┘
Color: Purple (#9333EA)
Hover: Darker Purple
```

---

## 🔄 User Flow Visualization

### Step 1: Browse Devices
```
┌─────────────────────────────────────┐
│ PriceWize - Browse Devices          │
│                                     │
│ [iPhone 14 Pro]  [Samsung S24]      │
│ [MacBook Pro]    [Dell XPS 13]      │
│ [iPad Pro]       [Galaxy Tab]       │
│ [Pixel 8]        [OnePlus 12]       │
│                                     │
└─────────────────────────────────────┘
```

### Step 2: Click Device
```
┌─────────────────────────────────────┐
│ iPhone 14 Pro - Price Comparison    │
│                                     │
│ [Add to Compare] ← Click here!      │
│                                     │
│ Price Listings...                   │
│                                     │
└─────────────────────────────────────┘
```

### Step 3: Add to Compare
```
┌─────────────────────────────────────┐
│ iPhone 14 Pro - Price Comparison    │
│                                     │
│ [✓ In Compare (1)] ← Button changed │
│                                     │
│ Price Listings...                   │
│                                     │
└─────────────────────────────────────┘
```

### Step 4: Add Another Device
```
┌─────────────────────────────────────┐
│ Samsung Galaxy S24 - Price Comp.    │
│                                     │
│ [Add to Compare] ← Click here!      │
│                                     │
│ Price Listings...                   │
│                                     │
└─────────────────────────────────────┘
```

### Step 5: View Comparison
```
┌─────────────────────────────────────┐
│ Samsung Galaxy S24 - Price Comp.    │
│                                     │
│ [✓ In Compare (2)]                  │
│ [View Comparison (2)] ← Click here! │
│                                     │
│ Price Listings...                   │
│                                     │
└─────────────────────────────────────┘
```

### Step 6: See Comparison
```
┌─────────────────────────────────────┐
│ Device Comparison                   │
│                                     │
│ Overall Statistics                  │
│ ├─ Lowest Price: ₨62,500            │
│ ├─ Highest Price: ₨80,000           │
│ ├─ Average Price: ₨71,250           │
│ └─ Total Listings: 6                │
│                                     │
│ Comparison Table                    │
│ Device          │ Lowest │ Highest │
│ iPhone 14 Pro   │ ₨62.5K │ ₨65K    │
│ Samsung S24     │ ₨75K   │ ₨80K    │
│                                     │
│ Individual Details...               │
│                                     │
└─────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Mobile View
```
┌──────────────────┐
│ Device Details   │
│                  │
│ [Add to Compare] │
│ (Full width)     │
│                  │
│ Price Listings   │
│ (Stacked)        │
│                  │
└──────────────────┘
```

### Tablet View
```
┌────────────────────────────────┐
│ Device Details                 │
│                                │
│ [Add to Compare]               │
│ (Half width)                   │
│                                │
│ Price Listings (2 columns)     │
│                                │
└────────────────────────────────┘
```

### Desktop View
```
┌──────────────────────────────────────────┐
│ Device Details                           │
│                                          │
│ [Add to Compare]                         │
│ (Auto width)                             │
│                                          │
│ Price Listings (3 columns)               │
│                                          │
└──────────────────────────────────────────┘
```

---

## ✨ Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Add Button | Blue | #2563EB |
| In Compare Button | Green | #16A34A |
| View Comparison | Purple | #9333EA |
| Browse More | Blue | #2563EB |
| Background | Light Gray | #F3F4F6 |
| Text | Dark Gray | #111827 |
| Border | Light Gray | #E5E7EB |

---

## 🎯 Summary

- ✅ Clear, intuitive UI
- ✅ Visual feedback on button states
- ✅ Responsive design
- ✅ Easy to understand flow
- ✅ Professional appearance


