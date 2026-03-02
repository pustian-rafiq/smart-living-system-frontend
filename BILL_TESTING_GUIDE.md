# Bill Design Testing Guide

## Quick Start

### 1. Start the Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in terminal)

### 2. Set User Role for Testing

The bills page shows different views based on user role. To test both views:

#### **Option A: Using Browser Console (Quick Method)**

1. Open the app in your browser
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Run one of these commands:

```javascript
// Test as OWNER (shows all automation features)
sessionStorage.setItem('userRole', 'owner')
sessionStorage.setItem('isLoggedIn', 'true')
window.location.reload()

// Test as RENTER (shows simple bills list)
sessionStorage.setItem('userRole', 'renter')
sessionStorage.setItem('isLoggedIn', 'true')
window.location.reload()
```

#### **Option B: Using Login Flow**

1. Go to `/login`
2. Enter a phone number (any number works)
3. Go to `/otp-verify` and enter any OTP
4. On `/role-selection`, select **Owner** or **Renter**
5. Navigate to `/bills`

### 3. Navigate to Bills Page

- **Direct URL**: `http://localhost:3000/bills`
- **From Dashboard**: Click "Bills" in the navigation
- **From Bottom Nav**: Click the "Bills" tab (mobile)

---

## Testing Checklist

### ✅ **OWNER View** (Full Features)

#### **1. Bills Tab**
- [ ] View all bills in grid layout
- [ ] Filter bills by status (All, Paid, Unpaid, Overdue)
- [ ] Click "Generate Bill" button
- [ ] Fill out bill generation form:
  - Select property type (Apartment/Mess)
  - Select property
  - Select tenant
  - Select month and year
  - Add bill items (description, type, amount)
  - Add multiple items
  - Remove items
- [ ] Submit bill generation
- [ ] Verify new bill appears in the list
- [ ] Click "Mark as Paid" on a bill
- [ ] Verify bill status changes to "Paid"
- [ ] Click "Download" button (shows alert)

#### **2. Templates Tab**
- [ ] View existing bill templates
- [ ] Click "Create Template" button
- [ ] Fill out template form:
  - Enter template name
  - Select property type
  - Select property
  - Toggle "Active" switch
  - Add template items:
    - **Fixed Amount**: Enter fixed amount
    - **Meter Based**: Select meter type (Electricity/Gas/Water) and unit rate
    - **Percentage**: Enter percentage and select base item
  - Add multiple items
  - Remove items
- [ ] Submit template
- [ ] Verify template appears in the list
- [ ] Click "Edit" icon on a template
- [ ] Modify template and save
- [ ] Toggle template active/inactive switch
- [ ] Click "Delete" icon (confirm deletion)

#### **3. Meter Readings Tab**
- [ ] View existing meter readings
- [ ] Click "Add Reading" button
- [ ] Fill out meter reading form:
  - Select property type
  - Select property
  - Select flat (for apartments)
  - Select month and year
  - Enter electricity reading
  - Enter gas reading
  - Enter water reading
- [ ] Verify previous reading is shown (if available)
- [ ] Verify consumption is calculated automatically
- [ ] Submit reading
- [ ] Verify new reading appears in the list
- [ ] Click "Edit" on a reading
- [ ] Modify and save

#### **4. Automation Tab**
- [ ] View existing automation rules
- [ ] Click "Create Rule" button
- [ ] Fill out rule form:
  - Enter rule name
  - Select bill template
  - Select property type (optional)
  - Select property (optional)
  - Configure schedule:
    - **Monthly**: Set day of month, generate before days, due date day
    - **Weekly**: Select day of week
    - **Custom**: (if implemented)
  - Toggle "Active" switch
- [ ] Submit rule
- [ ] Verify rule appears in the list
- [ ] Check "Next Run" date is calculated
- [ ] Check "Last Run" date (if available)
- [ ] Click "Edit" icon
- [ ] Modify rule and save
- [ ] Toggle rule active/inactive switch
- [ ] Click "Delete" icon (confirm deletion)

### ✅ **RENTER View** (Simple View)

- [ ] View only your bills (filtered by tenant ID)
- [ ] Filter bills by status
- [ ] View bill details
- [ ] Click "Download" button
- [ ] Verify automation tabs are NOT visible
- [ ] Verify "Generate Bill" button is NOT visible

---

## Visual Testing

### **Responsive Design**
- [ ] Test on mobile viewport (< 640px)
- [ ] Test on tablet viewport (640px - 1024px)
- [ ] Test on desktop viewport (> 1024px)
- [ ] Verify tabs stack properly on mobile
- [ ] Verify cards grid adjusts (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Verify dialogs are scrollable on mobile

### **UI Elements**
- [ ] Check all buttons are clickable
- [ ] Verify hover effects on cards
- [ ] Check badge colors (Active/Inactive, Paid/Unpaid/Overdue)
- [ ] Verify icons display correctly
- [ ] Check form validation messages
- [ ] Verify loading states (if any)
- [ ] Check empty states (no bills, no templates, etc.)

### **Dark Mode**
- [ ] Toggle dark mode (theme toggle in header)
- [ ] Verify all components look good in dark mode
- [ ] Check text contrast
- [ ] Verify card borders and backgrounds

---

## Functional Testing

### **Bill Generation**
1. Create a new bill manually
2. Verify it appears in the bills list
3. Check all bill items are included
4. Verify total amount is correct

### **Template Usage**
1. Create a template with:
   - Fixed rent amount
   - Meter-based electricity
   - Meter-based gas
   - Percentage-based maintenance (5% of rent)
2. Use template to generate a bill
3. Verify calculations are correct

### **Meter Reading Calculation**
1. Add a meter reading for March 2024:
   - Electricity: 1250 units
   - Gas: 45 units
   - Water: 120 units
2. Add previous reading (February 2024):
   - Electricity: 1180 units
   - Gas: 42 units
   - Water: 115 units
3. Verify consumption is calculated:
   - Electricity: 70 units (1250 - 1180)
   - Gas: 3 units (45 - 42)
   - Water: 5 units (120 - 115)

### **Automation Rules**
1. Create a monthly rule:
   - Day of month: 1
   - Generate before: 0 days
   - Due date day: 5
2. Verify "Next Run" is calculated correctly
3. Toggle rule inactive
4. Verify rule shows as "Inactive"

---

## Common Issues to Check

### **Form Validation**
- [ ] Try submitting empty forms
- [ ] Enter invalid data (negative numbers, text in number fields)
- [ ] Verify error messages appear
- [ ] Check required field indicators

### **Data Persistence**
- [ ] Create a template, refresh page, verify it's still there
- [ ] Create a meter reading, refresh page, verify it persists
- [ ] Note: In production, this would be saved to a database

### **Edge Cases**
- [ ] Create bill with no items (should show error)
- [ ] Create template with only percentage items (no base item)
- [ ] Add meter reading without previous reading
- [ ] Create rule without selecting template

---

## Browser Console Testing

Open browser console (F12) and check for:
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No network errors (if API calls are made)
- [ ] Check console logs for debugging info

---

## Performance Testing

- [ ] Page loads quickly
- [ ] Dialogs open smoothly
- [ ] Forms respond quickly to input
- [ ] Large lists (100+ bills) render efficiently
- [ ] No lag when toggling switches

---

## Accessibility Testing

- [ ] All buttons have proper labels
- [ ] Form fields have associated labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader friendly (if testing with screen reader)
- [ ] Color contrast meets WCAG standards

---

## Quick Test Script

Run this in browser console to quickly test all features:

```javascript
// Set as owner
sessionStorage.setItem('userRole', 'owner')
sessionStorage.setItem('isLoggedIn', 'true')

// Navigate to bills
window.location.href = '/bills'

// After page loads, test:
// 1. Click "Generate Bill" - should open dialog
// 2. Click "Templates" tab - should show templates
// 3. Click "Create Template" - should open template dialog
// 4. Click "Meter Readings" tab - should show readings
// 5. Click "Add Reading" - should open reading dialog
// 6. Click "Automation" tab - should show rules
// 7. Click "Create Rule" - should open rule dialog
```

---

## Expected Results

### **Owner View Should Show:**
- ✅ 4 tabs: Bills, Templates, Meter Readings, Automation
- ✅ "Generate Bill" button in header
- ✅ All bills from all tenants
- ✅ Full CRUD operations on templates, readings, and rules

### **Renter View Should Show:**
- ✅ Only "Bills" section (no tabs)
- ✅ Only bills for the logged-in renter
- ✅ No "Generate Bill" button
- ✅ No automation features

---

## Troubleshooting

### **If tabs don't show:**
- Check user role is set to 'owner'
- Check browser console for errors
- Verify sessionStorage has 'userRole' = 'owner'

### **If forms don't submit:**
- Check form validation errors
- Verify all required fields are filled
- Check browser console for errors

### **If data doesn't persist:**
- This is expected - mock data resets on page refresh
- In production, data would be saved to a database

---

## Next Steps After Testing

1. **Report Issues**: Note any bugs or UI issues
2. **Suggest Improvements**: Share feedback on UX
3. **Test Edge Cases**: Try unusual inputs
4. **Performance**: Check with large datasets
5. **Integration**: Test with real API (when backend is ready)
