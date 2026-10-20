# Firebase notifications for Nyaysaathi admins

## What this implementation sends

- Submitting the appointment form saves an appointment as `PENDING_PAYMENT` without sending an alert while the visitor is still checking out.
- If the visitor closes Razorpay Checkout without completing payment (including after failed attempts), the server checks the current order and Razorpay payment state, then sends the pending-payment email and admin push alert. Retries inside an open checkout do not trigger an alert. The pending alert is sent at most once per appointment.
- When payment is verified and the appointment first changes to `CONFIRMED`, registered admins receive a confirmation alert. Repeated callbacks do not send another confirmation alert.
- A notification opens `/admin-lawyersite/appointments`. Client names, contact details, and legal matters are not included in the push payload.
- Existing email notifications continue using `LAWYER_EMAIL`. Push notifications go to enrolled browsers, not to an email address.

Only an authenticated `ADMIN` or `SUPER_ADMIN` account that still exists in PostgreSQL can enroll a device. Tokens are stored against that admin, and delivery rechecks the database role. No public topics, Firebase Authentication, or Firestore database are used. Customers never see a permission prompt. Each admin must opt in on each browser/device.

## 1. Set up Firebase

1. Open the [Firebase console](https://console.firebase.google.com/) and create a project, or select your existing project. Google Analytics is optional for this feature.
2. In **Project settings → General → Your apps**, register a **Web** app. Hosting is not required because this site stays on your Ubuntu server.
3. From the web app configuration, copy `projectId`, `apiKey`, `appId`, and `messagingSenderId`. All values must come from the same project.
4. In **Project settings → Cloud Messaging**, ensure the Firebase Cloud Messaging API (HTTP v1) is enabled. Under **Web Push certificates**, generate a key pair and copy its **public** key.
5. In **Project settings → Service accounts → Firebase Admin SDK**, generate a new private key and download the service-account JSON. Keep this private file outside the repository. Do not paste it into chat or frontend code.
6. Encode the JSON as a single base64 line. On Windows PowerShell, adjust the path and run:

   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\secure\firebase-service-account.json")) | Set-Clipboard
   ```

   This copies the value for `FIREBASE_SERVICE_ACCOUNT_BASE64` to your clipboard. Base64 is an encoding, not encryption; handle the result as a private key.

## 2. Configure the Ubuntu server

SSH into the server and edit its existing environment file:

```bash
cd /opt/lawyerwebsite
sudo nano docker.env
```

Add the following values. Keep each value on one line:

```dotenv
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_WEB_API_KEY=your-web-apiKey
FIREBASE_WEB_APP_ID=your-web-appId
FIREBASE_MESSAGING_SENDER_ID=your-messagingSenderId
FIREBASE_WEB_VAPID_KEY=your-public-web-push-certificate-key
FIREBASE_SERVICE_ACCOUNT_BASE64=your-encoded-private-service-account-json
```

These settings are read by the backend at runtime. Only the four public web app values and public VAPID key are returned to authenticated admins. The private service account is never returned to the browser. Do not put these settings in `NEXT_PUBLIC_*` variables, GitHub source files, or the frontend Docker build arguments.

## 3. Deploy the code

Commit and push the implementation to `main` to use the existing GitHub Actions deployment, or pull and rebuild manually on Ubuntu:

```bash
cd /opt/lawyerwebsite
git pull --ff-only origin main
docker compose --env-file docker.env up -d --build
docker compose --env-file docker.env logs --tail=80 backend
curl --fail http://127.0.0.1:5000/api/health
```

The backend startup applies committed Prisma migrations, adding `AdminPushDevice` and the appointment's `pendingPaymentAlertedAt` marker. It does not reset the database. The frontend build bundles the Firebase service worker locally; no CDN worker scripts are required. The generated worker is ignored by Git and recreated by `npm run build` or `npm run dev`.

If only Firebase environment values change after the feature has been deployed, recreate the backend:

```bash
docker compose --env-file docker.env up -d --force-recreate backend
```

Firebase is optional. Missing or invalid configuration leaves the site, bookings, and email delivery available; the admin controls show that notifications have not been set up.

## 4. Enable notifications for the admin

1. Open `https://nyaysaathi.in/admin-lawyersite` and sign in with your admin account.
2. In **Booking notifications**, select **Enable notifications** and choose **Allow** in the browser prompt.
3. Repeat on other admin devices that should receive alerts. Other visitors and devices do not receive these alerts.
4. On iPhone or iPad, use Safari to add the admin panel to the Home Screen, launch that installed app, sign in, and enable notifications there. Web push on iOS/iPadOS requires a supported version (16.4 or later) and Home Screen installation.

While a site window is visible, alerts appear as a message on the page with a link to appointments. When the site is in the background, the service worker displays a system notification. A later payment alert replaces the pending alert for that same appointment in the notification tray.

Registrations expire with the admin login token (currently seven days). Opening the admin panel refreshes registration against the current session. After session expiry, sign in again. Logging out removes enrollment and the push subscription for this browser and closes its displayed notifications. **Turn off notifications** does the same without logging out. Logging out does not disable other admin devices.

## 5. Check the full flow

1. From a different browser or a private window, submit the consultation form. Check that the admin panel lists `Pending Payment` but no pending-payment alert is sent while you are on the payment step or inside an open checkout.
2. Open Razorpay Checkout and close it without paying. Verify the pending alert arrives and opens the authenticated appointments page. A failed attempt followed by a retry in the same popup must not alert the admin until checkout closes.
3. Complete a payment using your intended test/live payment environment and check for the confirmation alert. Live Razorpay payments charge real money.
4. Turn notifications off (or log out), submit another booking, open and close its checkout without paying, and confirm that browser does not display the pending alert.

Push delivery depends on browser permission, OS settings, connectivity, and Firebase. A provider failure does not roll back the booking or payment. The admin appointment list remains the source of truth. Simply closing the browser tab without the Razorpay dismissal callback does not send an unpaid alert; no automatic abandonment timer is scheduled. The server suppresses pending alerts when Razorpay reports payment success or an attempt that is still processing, and never marks a payment failed solely from a browser callback.

## Troubleshooting

- **Notifications have not been set up yet:** check all six environment values and recreate the backend. The service account must belong to `FIREBASE_PROJECT_ID`.
- **Permission was blocked:** change the notification permission in the browser's site settings, then enable again from the admin panel.
- **Registration fails:** check that the web app values and VAPID key belong to the same project, Firebase Cloud Messaging API is enabled, and Firebase Installations / FCM Registration requests are not blocked by API key restrictions, extensions, or the network.
- **Works in the page but not in the background:** verify notification/Focus settings on the device and allow background browser operation. Some operating systems will not deliver after the browser is force-quit.
- **No alerts after seven days:** sign in again and reopen the admin panel to refresh the registration.
- **Backend delivery errors:** inspect `docker compose --env-file docker.env logs --tail=100 backend`; logs report provider error codes without printing device tokens or private keys.

## Local checks

```powershell
npm run test:notifications
npm run test:tracking
npm run build
npm run test:seo
cd backend
npx prisma validate
npm run build
```

Automated tests use mocked Firebase delivery and database calls. Real end-to-end delivery still needs your Firebase project, deployed HTTPS site, and a browser with permission enabled.

References: [Firebase web setup](https://firebase.google.com/docs/cloud-messaging/web/get-started), [web message handling](https://firebase.google.com/docs/cloud-messaging/web/receive-messages), [token management](https://firebase.google.com/docs/cloud-messaging/manage-tokens).
