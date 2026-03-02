# Smart Living Ecosystem - Complete Testing Guide

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Authentication Flow](#authentication-flow)
3. [Renter Role Testing](#renter-role-testing)
4. [Owner Role Testing](#owner-role-testing)
5. [Admin Role Testing](#admin-role-testing)
6. [Common Features Testing](#common-features-testing)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Code editor (VS Code recommended)

### Installation Steps

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open browser and navigate to: `http://localhost:3000` (or the port shown in terminal)
   - Default port: `3000` or `3001`

### Important Notes
- The application uses **sessionStorage** for authentication (mock implementation)
- All data is **mock data** stored in `frontend/data/` directory
- No backend connection required for testing
- OTP verification uses mock OTP: `123456`

---

## 🔐 Authentication Flow

### Step 1: Access Login Page
1. Navigate to `/login` or click "Login" from home page
2. You should see:
   - Phone number input with +880 prefix
   - Language toggle (বাংলা/English)
   - Send OTP button
   - Terms & conditions links

### Step 2: Enter Phone Number
1. Enter a valid Bangladesh phone number:
   - Format: `01712345678` or `8801712345678`
   - The system will auto-format to `+880 1712345678`
2. Click "Send OTP" button
3. You should be redirected to `/otp-verify`

### Step 3: OTP Verification
1. On OTP page, you should see:
   - 6 input fields for OTP
   - Auto-read simulation (after 2 seconds, OTP `123456` will be filled)
   - Resend OTP button (disabled for 60 seconds)
   - Timer countdown
2. **Mock OTP**: `123456` (auto-filled after 2 seconds)
3. If OTP is correct, click "Verify OTP"
4. You should be redirected to `/role-selection`

### Step 4: Role Selection
1. You should see two options:
   - **Student/Renter** - For finding accommodation
   - **Owner/Manager** - For managing properties
2. Select your role:
   - Click "Student/Renter" → Sets role to `renter`
   - Click "Owner/Manager" → Sets role to `owner`
3. You will be redirected to `/dashboard` based on selected role

### Step 5: Admin Access (Special)
- Admin role is not available through normal flow
- To test admin features, manually set in browser console:
  ```javascript
  sessionStorage.setItem('userRole', 'admin')
  sessionStorage.setItem('isLoggedIn', 'true')
  ```
- Then navigate to `/dashboard` or `/admin`

---

## 👤 Renter Role Testing

### Dashboard (`/dashboard`)

#### Test Steps:
1. **Access Dashboard**
   - After login and role selection, you should land on `/dashboard`
   - Verify you see "Renter Dashboard"

2. **Check Dashboard Elements**
   - ✅ Welcome message with user name
   - ✅ Verification badge
   - ✅ Phone number display
   - ✅ Location selector (City/Area dropdowns)
   - ✅ Search bar
   - ✅ Quick action cards:
     - Find Mess
     - Find Apartment
   - ✅ Stats cards (if applicable)
   - ✅ Recent activity section

3. **Test Location Selector**
   - Select different cities (Dhaka, Chattogram, Sylhet, Khulna)
   - Verify area dropdown updates based on city
   - Select different areas

4. **Test Search Functionality**
   - Type in search bar
   - Verify search results update (if implemented)

5. **Test Quick Actions**
   - Click "Find Mess" → Should navigate to `/search?type=mess`
   - Click "Find Apartment" → Should navigate to `/search?type=apartment`

---

### Search & Discovery (`/search`)

#### Test Steps:
1. **Access Search Page**
   - Navigate to `/search` from dashboard or bottom navigation
   - Verify search page loads with filters and results

2. **Test Filters**
   - **Property Type**: Select Mess/Apartment/All
   - **City**: Select from dropdown (All Cities, Dhaka, Chattogram, etc.)
   - **Area**: Select from dropdown (updates based on city)
   - **Rent Range**: Use slider to set min/max rent
   - **Availability**: Toggle on/off
   - **Gender**: Select Male/Female/All (for Mess)
   - **Seat Type**: Select Single/Shared/All (for Mess)
   - **Meal Included**: Toggle on/off (for Mess)
   - **Advanced Filters**: 
     - Nearby facilities
     - Building age
     - Floor level
     - Furnishing
     - Parking
     - Security features

3. **Test Search Results**
   - Verify property cards display correctly
   - Check each card shows:
     - Property image
     - Property name
     - Rent amount
     - Location (city, area)
     - Availability status
     - Gender badge (for Mess)
     - Verified badge (if applicable)
   - Verify "Call" button works
   - Verify "View Details" button opens detail modal

4. **Test Property Detail Modal**
   - Click "View Details" on any property
   - Verify modal shows:
     - Image gallery with thumbnails
     - Full property information
     - Facilities list with icons
     - Owner information
     - Map location (if implemented)
     - Video walkthrough (if available)
   - Test "Request Seat/Flat" button
   - Test "Add to Favorites" button
   - Test "Share" button

5. **Test Map View** (if implemented)
   - Toggle between List and Map view
   - Verify map displays property markers
   - Click markers to see property details
   - Test location-based search

6. **Test Verified Listings Filter**
   - Toggle "Verified Only" filter
   - Verify only verified properties show
   - Check verified badge on property cards

7. **Test Reset Filters**
   - Click "Reset" button
   - Verify all filters clear
   - Verify all properties show again

---

### My Bookings (`/my-bookings`)

#### Test Steps:
1. **Access Bookings Page**
   - Navigate to `/my-bookings` from dashboard or menu
   - Verify bookings list displays

2. **Test Booking Status**
   - Check different status badges:
     - Pending (yellow)
     - Confirmed (green)
     - Cancelled (red)
     - Completed (gray)

3. **Test Booking Actions**
   - Click on a booking to view details
   - Test "Cancel Booking" button
   - Test "Modify Booking" button
   - Test "View Property" link

4. **Test Booking Calendar** (if implemented)
   - View calendar with booking dates
   - Check color-coded dates
   - Click dates to see booking details

---

### Messages/Chat (`/messages`)

#### Test Steps:
1. **Access Messages Page**
   - Navigate to `/messages` from bottom navigation
   - Verify chat list displays

2. **Test Chat List**
   - Check unread message count badge
   - Verify chat list shows:
     - Property/owner name
     - Last message preview
     - Timestamp
     - Unread indicator

3. **Test Chat Conversation**
   - Click on a chat to open conversation
   - Verify message history displays
   - Test sending a message
   - Test file sharing (if implemented)
   - Test emoji picker (if implemented)
   - Test message timestamps

4. **Test New Chat**
   - Click "New Message" or start chat from property detail
   - Select property/owner
   - Send initial message
   - Verify chat appears in list

---

### Bills & Payments (`/bills`)

#### Test Steps:
1. **Access Bills Page**
   - Navigate to `/bills` from bottom navigation
   - Verify bills list displays

2. **Test Bill Status**
   - Check different status badges:
     - Paid (green)
     - Unpaid (yellow)
     - Overdue (red)

3. **Test Bill Details**
   - Click on a bill to view details
   - Verify bill items breakdown:
     - Rent
     - Electricity
     - Gas
     - Water
     - Service charge
   - Check due date and paid date
   - Verify total amount

4. **Test Bill Actions**
   - Test "Download Receipt" button (mock)
   - Test "Pay Now" button (if implemented)
   - Test "View Payment History" link

5. **Test Filters**
   - Filter by status (All/Paid/Unpaid/Overdue)
   - Filter by month/year
   - Verify filtered results

---

### Saved Searches (`/saved-searches`)

#### Test Steps:
1. **Access Saved Searches**
   - Navigate to `/saved-searches`
   - Verify saved searches list displays

2. **Test Saved Search Card**
   - Check search criteria displayed
   - Verify match count
   - Test "View Results" button
   - Test "Edit Search" button
   - Test "Delete" button

3. **Test Notifications**
   - Check notification toggle for each search
   - Verify notification settings save

4. **Test Create Saved Search**
   - Go to search page
   - Set filters
   - Click "Save Search"
   - Verify search appears in saved searches

---

### Search History (`/search-history`)

#### Test Steps:
1. **Access Search History**
   - Navigate to `/search-history`
   - Verify recent searches list displays

2. **Test Search History Items**
   - Check search criteria displayed
   - Test "Search Again" button
   - Test "Delete" button
   - Test "Clear All" button

3. **Test Quick Access**
   - Click on a history item
   - Verify search page opens with saved criteria

---

### Favorites/Wishlist (`/favorites`)

#### Test Steps:
1. **Access Favorites**
   - Navigate to `/favorites`
   - Verify favorites list displays

2. **Test Favorite Properties**
   - Check property cards display
   - Test "Remove from Favorites" button
   - Test "Compare Properties" button
   - Test "Share" button

3. **Test Property Comparison**
   - Select 2-3 properties
   - Click "Compare"
   - Verify comparison table shows:
     - Side-by-side comparison
     - Key features comparison
     - Price comparison

4. **Test Add to Favorites**
   - Go to search page
   - Click "Add to Favorites" on property card
   - Verify property appears in favorites

---

### Profile & Settings (`/profile`)

#### Test Steps:
1. **Access Profile Page**
   - Navigate to `/profile` from bottom navigation
   - Verify profile information displays

2. **Test Profile Information**
   - Check personal details:
     - Name
     - Phone
     - Email
     - Role
     - Verification status
   - Test "Edit Profile" button

3. **Test Profile Edit Form**
   - Click "Edit Profile"
   - Update name, email
   - Upload profile photo (mock)
   - Test form validation
   - Save changes
   - Verify updates reflect

4. **Test NID/Passport Storage**
   - Navigate to Documents section
   - Upload NID/Passport document
   - Verify document displays
   - Check verification status
   - Test expiry tracking

5. **Test Job/Institute Field**
   - Add job title/company
   - Add institute name
   - Add student ID
   - Verify information saves

6. **Test Family Members**
   - Add family member
   - Enter details (name, relation, photo)
   - Add emergency contact
   - Test edit/delete family member

7. **Test History Tab**
   - Click "History" tab
   - Verify renter history displays:
     - Previous rental history
     - Payment history
     - Complaint history
     - Move-in/move-out dates
     - References from previous owners
     - Ratings from previous owners

8. **Test Settings**
   - **Language Toggle**: Switch between বাংলা/English
   - **Theme Toggle**: Switch between Light/Dark mode
   - Verify settings persist

---

### Documents (`/documents`)

#### Test Steps:
1. **Access Documents Page**
   - Navigate to `/documents` from dashboard or profile
   - Verify documents list displays

2. **Test Digital Agreement Copy**
   - Upload rental agreement (PDF)
   - Verify document displays
   - Test "View" button
   - Test "Download" button
   - Check expiry date tracking
   - Test renewal reminders

3. **Test Move-in Checklist**
   - Click "Move-in Checklist"
   - Fill item condition tracking
   - Upload photos
   - Save checklist
   - Verify checklist displays

4. **Test Move-out Checklist**
   - Click "Move-out Checklist"
   - Fill damage assessment
   - Upload photos
   - Calculate security deposit return
   - Save checklist

---

### Payments (`/payments`)

#### Test Steps:
1. **Access Payments Page**
   - Navigate to `/payments` from dashboard or bills
   - Verify payments list displays

2. **Test Payment Scheduling**
   - Click "Schedule Payment"
   - Select future date
   - Enter payment amount
   - Set payment method
   - Save scheduled payment
   - Verify payment appears in list

3. **Test Auto-pay Setup**
   - Enable auto-pay for a bill
   - Configure payment method
   - Set payment date
   - Verify auto-pay status

4. **Test Payment History**
   - View payment history
   - Check payment status
   - Test filters (date range, status)

---

### Expense Analytics (`/expenses`)

#### Test Steps:
1. **Access Expenses Page**
   - Navigate to `/expenses` from dashboard
   - Verify expense analytics displays

2. **Test Monthly Breakdown**
   - Check monthly housing cost breakdown
   - Verify category-wise spending
   - Test month selector

3. **Test Charts & Graphs**
   - Check expense trends chart
   - Verify category breakdown chart
   - Test chart interactions

4. **Test Budget Tracking**
   - Set monthly budget
   - Check budget vs actual spending
   - Verify budget alerts

---

### Reminders (`/reminders`)

#### Test Steps:
1. **Access Reminders Page**
   - Navigate to `/reminders` from dashboard
   - Verify reminders list displays

2. **Test Reminder Settings**
   - Configure auto reminders
   - Set reminder days before rent
   - Select reminder channels (SMS, Push, Email)
   - Save settings

3. **Test Reminder History**
   - View reminder history
   - Check reminder status
   - Verify reminder delivery

---

### Reports (`/reports`)

#### Test Steps:
1. **Access Reports Page**
   - Navigate to `/reports` from dashboard
   - Verify reports list displays

2. **Test Generate Report**
   - Click "Generate Report"
   - Select report type (Monthly/Yearly/Custom)
   - Select date range
   - Generate report
   - Verify report displays

3. **Test Export Reports**
   - Test "Export to PDF" button
   - Test "Export to Excel" button
   - Verify files download (mock)

4. **Test Tax Documents**
   - Generate tax document
   - Verify tax information
   - Export tax document

---

### Complaints (`/complaints`)

#### Test Steps:
1. **Access Complaints Page**
   - Navigate to `/complaints`
   - Verify complaints list displays

2. **Test Submit Complaint**
   - Click "Submit Complaint"
   - Fill complaint form:
     - Title
     - Description
     - Category
     - Upload image (optional)
   - Submit complaint
   - Verify complaint appears in list

3. **Test Complaint Status**
   - Check status badges:
     - Open (yellow)
     - In Progress (blue)
     - Resolved (green)
   - Test status filters

4. **Test Complaint Details**
   - Click on complaint to view details
   - Check owner response
   - Test "Add Response" button

---

### Notifications (`/notifications`)

#### Test Steps:
1. **Access Notifications Page**
   - Navigate to `/notifications`
   - Verify notifications list displays

2. **Test Notification Types**
   - Check different notification types:
     - Bill reminders
     - Booking updates
     - Message notifications
     - System notifications
   - Verify icons and colors

3. **Test Notification Actions**
   - Click notification to view details
   - Test "Mark as Read" toggle
   - Test "Mark All as Read" button
   - Test notification links

---

### Rentals (`/rentals`)

#### Test Steps:
1. **Access Rentals Page**
   - Navigate to `/rentals`
   - Verify current rentals list displays

2. **Test Rental Details**
   - Click on rental to view details
   - Check property information
   - Check rental period
   - Check payment status

3. **Test Rental Actions**
   - Test "View Property" link
   - Test "View Bills" link
   - Test "Contact Owner" button

---

### Mess Student Dashboard (`/mess/student-dashboard`)

#### Test Steps:
1. **Access Student Dashboard**
   - Navigate to `/mess/student-dashboard`
   - Verify student dashboard displays

2. **Test Dashboard Elements**
   - Check assigned seat information
   - Check monthly fee display
   - Check notice board
   - Check mess details

3. **Test Menu View**
   - Navigate to `/mess/student-dashboard/menu`
   - Check current week's menu
   - Check today's menu
   - View menu history
   - Set meal preferences

4. **Test Attendance**
   - Navigate to `/mess/student-dashboard/attendance`
   - View attendance calendar
   - Check attendance reports
   - View absence tracking

---

## 🏢 Owner Role Testing

### Dashboard (`/dashboard`)

#### Test Steps:
1. **Access Dashboard**
   - Login as owner
   - Navigate to `/dashboard`
   - Verify "Owner Dashboard" displays

2. **Check Dashboard Elements**
   - ✅ Stats cards:
     - Total buildings
     - Total flats
     - Due rents
     - Occupancy rate
   - ✅ Quick action cards:
     - Add Building
     - Add Mess
     - Generate Rent
   - ✅ Recent activity section

3. **Test Quick Actions**
   - Click "Add Building" → Opens add building dialog
   - Click "Add Mess" → Navigate to mess page
   - Click "Generate Rent" → Navigate to bills page

---

### My Properties (`/my-properties`)

#### Test Steps:
1. **Access Properties Page**
   - Navigate to `/my-properties` from dashboard or bottom navigation
   - Verify buildings list displays

2. **Test Building List**
   - Check building cards display:
     - Building name
     - Address
     - Total flats
     - Occupancy percentage
     - Progress bar
   - Test "View Flats" button
   - Test "Add Building" button

3. **Test Add Building**
   - Click "Add Building"
   - Fill building form:
     - Building name
     - Address
     - City, Area
     - Total floors
     - Total flats
   - Submit form
   - Verify building appears in list

4. **Test Building Details**
   - Click on a building
   - Navigate to `/my-properties/buildings/[buildingId]/flats`
   - Verify flats list displays

---

### Flats Management (`/my-properties/buildings/[buildingId]/flats`)

#### Test Steps:
1. **Access Flats Page**
   - Click on a building from properties page
   - Verify flats list displays

2. **Test Flat List**
   - Check flat cards display:
     - Flat number
     - Floor number
     - Rent amount
     - Status badge (Available/Occupied/Maintenance)
   - Test status filter
   - Test "View Details" button

3. **Test Flat Detail Dialog**
   - Click "View Details" on a flat
   - Verify flat information displays
   - Test "Assign Renter" button
   - Test "View Renter Profile" button
   - Test "Generate Bill" button
   - Test "View Payment History" button

4. **Test Assign Renter**
   - Click "Assign Renter"
   - Select renter from dropdown
   - Set move-in date
   - Submit assignment
   - Verify flat status changes to "Occupied"

---

### Floor Management (`/my-properties/buildings/[buildingId]/floors`)

#### Test Steps:
1. **Access Floors Page**
   - Navigate to floors from building details
   - Verify floors list displays

2. **Test Add Floor**
   - Click "Add Floor"
   - Enter floor number
   - Enter floor name (optional)
   - Submit form
   - Verify floor appears in list

3. **Test Floor Organization**
   - Check floor-wise flat organization
   - Verify flats grouped by floor
   - Test floor statistics

4. **Test Floor Statistics**
   - Click on a floor
   - Navigate to `/my-properties/buildings/[buildingId]/floors/[floorId]/stats`
   - Verify floor statistics:
     - Total flats
     - Occupied flats
     - Available flats
     - Occupancy rate

---

### Bills & Rent Management (`/bills`)

#### Test Steps:
1. **Access Bills Page**
   - Navigate to `/bills` from dashboard
   - Verify bills list displays (owner view)

2. **Test Generate Bill**
   - Click "Generate Bill"
   - Select property/flat
   - Select tenant
   - Select month/year
   - Add bill items:
     - Rent
     - Electricity
     - Gas
     - Water
     - Service charge
   - Enter meter readings (if applicable)
   - Submit bill
   - Verify bill appears in list

3. **Test Automated Bill Generation**
   - Navigate to bill templates
   - Create bill template
   - Set up bill generation rules
   - Schedule automatic generation
   - Verify bills generate automatically

4. **Test Mark as Paid**
   - Click on a bill
   - Toggle "Mark as Paid"
   - Enter payment date
   - Submit
   - Verify bill status changes to "Paid"

5. **Test Bulk Bill Generation**
   - Click "Bulk Generate Bills"
   - Select multiple properties/flats
   - Select month/year
   - Generate bills
   - Verify all bills created

---

### Notices (`/notices`)

#### Test Steps:
1. **Access Notices Page**
   - Navigate to `/notices` from bottom navigation
   - Verify notices list displays

2. **Test Create Notice**
   - Click "Create Notice"
   - Fill notice form:
     - Title
     - Description
     - Category
     - Priority (High/Medium/Low)
     - Expiry date
     - Upload PDF/Image (optional)
   - Submit notice
   - Verify notice appears in list

3. **Test Notice Management**
   - View notice details
   - Check acknowledgment tracking
   - Test "Edit Notice" button
   - Test "Delete Notice" button

4. **Test Bulk Notice Sending**
   - Click "Bulk Send Notice"
   - Select multiple recipients
   - Select notice template
   - Send notice
   - Verify notices sent

---

### Mess Management (`/mess`)

#### Test Steps:
1. **Access Mess Overview**
   - Navigate to `/mess` from dashboard
   - Verify mess list displays

2. **Test Mess Cards**
   - Check mess information:
     - Mess name
     - Total seats
     - Available seats
     - Monthly fee
     - Occupancy progress bar
   - Test "Assign Student" button
   - Test "Manage Meals" button
   - Test "Attendance" button
   - Test "SMS" button

3. **Test Assign Student**
   - Click "Assign Student"
   - Fill student form:
     - Student name
     - Phone number
     - Institute name
     - Seat selection
   - Submit assignment
   - Verify student assigned

---

### Mess - Meal Management (`/mess/[messId]/meals`)

#### Test Steps:
1. **Access Meal Management**
   - Click "Manage Meals" on mess card
   - Navigate to `/mess/[messId]/meals`
   - Verify meal management page displays

2. **Test Meal Schedule**
   - Create weekly meal schedule
   - Set meal timings
   - Configure special meals
   - Save schedule

3. **Test Menu Upload**
   - Upload daily menu
   - Add menu categories
   - Upload menu images
   - Set meal options
   - Save menu

---

### Mess - Attendance (`/mess/[messId]/attendance`)

#### Test Steps:
1. **Access Attendance Page**
   - Click "Attendance" on mess card
   - Navigate to `/mess/[messId]/attendance`
   - Verify attendance page displays

2. **Test Mark Attendance**
   - Select students
   - Mark attendance status
   - Set check-in/check-out times
   - Add notes
   - Save attendance

3. **Test Attendance Calendar**
   - View attendance calendar
   - Check color-coded dates
   - Click dates to see attendance details

4. **Test Attendance Reports**
   - Generate attendance report
   - Select date range
   - View summary statistics
   - Export report

---

### Mess - SMS Management (`/mess/[messId]/sms`)

#### Test Steps:
1. **Access SMS Page**
   - Click "SMS" on mess card
   - Navigate to `/mess/[messId]/sms`
   - Verify SMS management page displays

2. **Test SMS Templates**
   - Create SMS template
   - Add variables (e.g., {studentName}, {amount})
   - Save template
   - Test template preview

3. **Test Send Bulk SMS**
   - Click "Send Bulk SMS"
   - Select recipients (All/Group)
   - Select template or write custom message
   - Schedule SMS (optional)
   - Send SMS
   - Verify SMS history

4. **Test SMS Groups**
   - Create SMS group
   - Add students to group
   - Save group
   - Use group for bulk SMS

5. **Test SMS History**
   - View SMS history
   - Check delivery status
   - View cost estimation
   - Filter by date/status

---

### Mess - Rules & Regulations (`/mess/[messId]/rules`)

#### Test Steps:
1. **Access Rules Page**
   - Navigate to `/mess/[messId]/rules`
   - Verify rules list displays

2. **Test Create Rule**
   - Click "Create Rule"
   - Fill rule form:
     - Title
     - Description
     - Category
     - Severity
     - Penalty (optional)
     - Requires acceptance toggle
   - Submit rule
   - Verify rule appears in list

3. **Test Rule Acceptance Tracking**
   - View rule acceptances
   - Check which students accepted
   - View acceptance history

4. **Test Violation Tracking**
   - View violations list
   - Filter by status/severity
   - Test "Resolve Violation" button
   - Add violation notes

---

### Mess - Expenses (`/mess/[messId]/expenses`)

#### Test Steps:
1. **Access Expenses Page**
   - Navigate to `/mess/[messId]/expenses`
   - Verify expenses list displays

2. **Test Add Expense**
   - Click "Add Expense"
   - Fill expense form:
     - Category (Food/Utilities/Maintenance/Staff/Supplies)
     - Description
     - Amount
     - Date
     - Vendor (optional)
     - Notes (optional)
   - Submit expense
   - Verify expense appears in list

3. **Test Expense Analytics**
   - View monthly summary
   - Check category breakdown
   - View expense charts
   - Test date range filters

4. **Test Expense Reports**
   - Generate expense report
   - Select report type (Monthly/Yearly/Custom)
   - Export report to PDF/Excel

---

### Bookings Management (`/my-properties/bookings`)

#### Test Steps:
1. **Access Bookings Page**
   - Navigate to `/my-properties/bookings`
   - Verify bookings list displays

2. **Test Booking Status**
   - Check different status badges:
     - Pending (yellow)
     - Confirmed (green)
     - Cancelled (red)
   - Test status filters

3. **Test Booking Actions**
   - Click on booking to view details
   - Test "Accept Booking" button
   - Test "Reject Booking" button
   - Test "View Property" link
   - Test "Contact Renter" button

4. **Test Booking Calendar**
   - View booking calendar
   - Check color-coded dates
   - Click dates to see booking details
   - Test calendar navigation

---

### My Hotels (`/my-hotels`)

#### Test Steps:
1. **Access Hotels Page**
   - Navigate to `/my-hotels`
   - Verify hotels list displays

2. **Test Hotel Management**
   - Click on a hotel
   - Navigate to hotel details
   - Test "Manage Rooms" button
   - Test "View Bookings" button
   - Test "View Calendar" button

3. **Test Room Management**
   - Navigate to `/my-hotels/[hotelId]/rooms`
   - Add/edit/delete rooms
   - Set room pricing
   - Configure room amenities

4. **Test Booking Management**
   - Navigate to `/my-hotels/[hotelId]/bookings`
   - View all bookings
   - Accept/reject bookings
   - Manage booking status

5. **Test Booking Calendar**
   - Navigate to `/my-hotels/[hotelId]/calendar`
   - View room availability calendar
   - Check booking status
   - Manage room availability

---

### Messages/Chat (`/messages`)

#### Test Steps:
1. **Access Messages Page**
   - Navigate to `/messages` from bottom navigation
   - Verify chat list displays

2. **Test Chat with Renters**
   - Click on a chat
   - View conversation history
   - Send messages
   - Share files (if implemented)
   - Test message notifications

---

### Profile & Settings (`/profile`)

#### Test Steps:
1. **Access Profile Page**
   - Navigate to `/profile` from bottom navigation
   - Verify profile information displays

2. **Test Profile Management**
   - Edit profile information
   - Upload profile photo
   - Update contact details
   - Save changes

3. **Test Settings**
   - Language toggle
   - Theme toggle
   - Notification settings

---

## 👨‍💼 Admin Role Testing

### Dashboard (`/dashboard` or `/admin`)

#### Test Steps:
1. **Access Admin Dashboard**
   - Login and set role to `admin` (see Authentication Flow)
   - Navigate to `/dashboard` or `/admin`
   - Verify admin dashboard displays

2. **Check Dashboard Elements**
   - ✅ Stats cards:
     - Total users
     - Total properties
     - Pending verifications
     - Active complaints
   - ✅ Quick action cards
   - ✅ Recent activity section
   - ✅ Analytics charts

---

### User Management (`/admin/users`)

#### Test Steps:
1. **Access Users Page**
   - Navigate to `/admin/users`
   - Verify users list displays

2. **Test User List**
   - Check user information:
     - Name
     - Phone
     - Email
     - Role
     - Verification status
   - Test user filters
   - Test search functionality

3. **Test User Actions**
   - View user details
   - Edit user information
   - Verify/unverify user
   - Suspend/activate user
   - Delete user (if applicable)

---

### Property Management (`/admin/properties`)

#### Test Steps:
1. **Access Properties Page**
   - Navigate to `/admin/properties`
   - Verify properties list displays

2. **Test Property List**
   - Check property information
   - Test property filters
   - Test search functionality

3. **Test Property Actions**
   - View property details
   - Verify/unverify property
   - Approve/reject property
   - Edit property information
   - Delete property (if applicable)

---

### Verifications (`/admin/verifications`)

#### Test Steps:
1. **Access Verifications Page**
   - Navigate to `/admin/verifications`
   - Verify pending verifications list displays

2. **Test Verification Process**
   - View verification request
   - Check submitted documents
   - Approve verification
   - Reject verification (with reason)
   - Verify status updates

---

### Complaints Management (`/admin/complaints`)

#### Test Steps:
1. **Access Complaints Page**
   - Navigate to `/admin/complaints`
   - Verify complaints list displays

2. **Test Complaint Management**
   - View complaint details
   - Assign complaint to staff
   - Add admin response
   - Resolve complaint
   - Test complaint filters

---

### Disputes Management (`/admin/disputes`)

#### Test Steps:
1. **Access Disputes Page**
   - Navigate to `/admin/disputes`
   - Verify disputes list displays

2. **Test Dispute Resolution**
   - View dispute details
   - Review evidence
   - Add resolution notes
   - Resolve dispute
   - Test dispute filters

---

### Audit Logs (`/admin/audit-logs`)

#### Test Steps:
1. **Access Audit Logs Page**
   - Navigate to `/admin/audit-logs`
   - Verify audit logs list displays

2. **Test Audit Log Viewing**
   - Check log entries:
     - Action type
     - User who made change
     - Timestamp
     - Old value
     - New value
   - Test log filters
   - Test search functionality

3. **Test Rollback Capability**
   - Click on a log entry
   - View change details
   - Test "Rollback" button (if implemented)
   - Verify rollback confirmation

---

### Analytics (`/admin/analytics`)

#### Test Steps:
1. **Access Analytics Page**
   - Navigate to `/admin/analytics`
   - Verify analytics dashboard displays

2. **Test Analytics Charts**
   - View user growth chart
   - View property statistics
   - View revenue analytics
   - View city-wise demand data
   - Test date range filters

3. **Test Reports**
   - Generate various reports
   - Export reports to PDF/Excel
   - View report history

---

### Settings (`/admin/settings`)

#### Test Steps:
1. **Access Settings Page**
   - Navigate to `/admin/settings`
   - Verify settings page displays

2. **Test System Settings**
   - Configure system parameters
   - Update platform information
   - Manage email templates
   - Configure SMS gateway
   - Save settings

---

## 🔄 Common Features Testing

### Theme Toggle
1. **Test Light Mode**
   - Click theme toggle (if available)
   - Verify light theme applies
   - Check all pages render correctly

2. **Test Dark Mode**
   - Click theme toggle
   - Verify dark theme applies
   - Check all pages render correctly
   - Verify theme persists on page refresh

### Language Toggle
1. **Test English**
   - Switch to English
   - Verify all text in English
   - Check all pages

2. **Test Bangla**
   - Switch to বাংলা
   - Verify all text in Bangla
   - Check all pages
   - Verify language persists

### Responsive Design
1. **Test Mobile View** (375px - 768px)
   - Resize browser to mobile size
   - Check all pages render correctly
   - Test bottom navigation
   - Test mobile menu (if applicable)

2. **Test Tablet View** (768px - 1024px)
   - Resize browser to tablet size
   - Check layout adapts
   - Test navigation

3. **Test Desktop View** (1024px+)
   - Resize browser to desktop size
   - Check full layout
   - Test sidebar navigation (if applicable)

### Navigation
1. **Test Bottom Navigation** (Mobile)
   - Verify bottom nav displays on mobile
   - Test all navigation items
   - Check active state highlighting

2. **Test Top Navigation** (Desktop)
   - Verify top nav displays on desktop
   - Test all navigation items
   - Check dropdown menus

### Error Handling
1. **Test 404 Page**
   - Navigate to non-existent route
   - Verify 404 page displays
   - Test "Go Home" button

2. **Test Form Validation**
   - Submit forms with empty fields
   - Verify validation messages
   - Test invalid input formats

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Cannot Login
**Solution:**
- Check if phone number format is correct (+880 format)
- Use mock OTP: `123456`
- Clear browser sessionStorage and try again
- Check browser console for errors

#### Issue: Role Not Switching
**Solution:**
- Clear sessionStorage:
  ```javascript
  sessionStorage.clear()
  ```
- Logout and login again
- Manually set role in console:
  ```javascript
  sessionStorage.setItem('userRole', 'renter') // or 'owner' or 'admin'
  ```

#### Issue: Data Not Loading
**Solution:**
- Check if mock data files exist in `frontend/data/`
- Verify file imports are correct
- Check browser console for errors
- Refresh the page

#### Issue: Styling Issues
**Solution:**
- Clear browser cache
- Restart development server
- Check if Tailwind CSS is properly configured
- Verify `globals.css` is imported

#### Issue: Navigation Not Working
**Solution:**
- Check if route exists in `app/` directory
- Verify Next.js Link components are used correctly
- Check browser console for errors

### Debug Commands

**Clear All Session Data:**
```javascript
sessionStorage.clear()
location.reload()
```

**Set Role Manually:**
```javascript
sessionStorage.setItem('userRole', 'renter') // or 'owner' or 'admin'
sessionStorage.setItem('isLoggedIn', 'true')
location.reload()
```

**Check Current Role:**
```javascript
console.log(sessionStorage.getItem('userRole'))
```

---

## 📝 Testing Checklist

### Renter Features
- [ ] Dashboard
- [ ] Search & Discovery
- [ ] Property Details
- [ ] Bookings
- [ ] Messages/Chat
- [ ] Bills & Payments
- [ ] Saved Searches
- [ ] Search History
- [ ] Favorites/Wishlist
- [ ] Profile & Settings
- [ ] Documents
- [ ] Payments
- [ ] Expense Analytics
- [ ] Reminders
- [ ] Reports
- [ ] Complaints
- [ ] Notifications
- [ ] Rentals
- [ ] Mess Student Dashboard

### Owner Features
- [ ] Dashboard
- [ ] My Properties
- [ ] Flats Management
- [ ] Floor Management
- [ ] Bills & Rent
- [ ] Notices
- [ ] Mess Management
- [ ] Meal Management
- [ ] Attendance
- [ ] SMS Management
- [ ] Rules & Regulations
- [ ] Expenses
- [ ] Bookings
- [ ] Hotels
- [ ] Messages
- [ ] Profile

### Admin Features
- [ ] Dashboard
- [ ] User Management
- [ ] Property Management
- [ ] Verifications
- [ ] Complaints
- [ ] Disputes
- [ ] Audit Logs
- [ ] Analytics
- [ ] Settings

### Common Features
- [ ] Theme Toggle
- [ ] Language Toggle
- [ ] Responsive Design
- [ ] Navigation
- [ ] Error Handling

---

## 🎯 Testing Tips

1. **Test in Different Browsers**: Chrome, Firefox, Edge, Safari
2. **Test on Different Devices**: Mobile, Tablet, Desktop
3. **Test with Different Roles**: Renter, Owner, Admin
4. **Test Edge Cases**: Empty states, error states, loading states
5. **Test Form Validations**: Required fields, format validations
6. **Test Navigation**: All links and buttons
7. **Test Data Persistence**: Refresh page, check if data persists
8. **Test Responsive Design**: Resize browser window
9. **Test Theme & Language**: Switch themes and languages
10. **Test Error Handling**: Invalid inputs, network errors

---

## 📞 Support

If you encounter any issues during testing:
1. Check browser console for errors
2. Check terminal for server errors
3. Verify all dependencies are installed
4. Clear browser cache and sessionStorage
5. Restart development server

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Complete Testing Guide
