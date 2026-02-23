Capacitor setup (brief)

This project includes optional Capacitor support to access native haptics (Taptic Engine) on iOS/Android.

Steps to initialize and build native apps locally (requires Node, Xcode for iOS, Android Studio for Android):

1. Install dependencies (already added to package.json)

   npm install

2. Initialize Capacitor (run once)

   npx cap init el-impostor com.example.elimpostor

3. Add platforms you need

   npx cap add ios
   npx cap add android

4. Build your web app and copy to native projects

   npm run build
   npx cap copy

5. Open native IDE to run on device

   npx cap open ios
   npx cap open android

6. In your app code we load `@capacitor/haptics` dynamically. On native builds the plugin will provide richer haptic feedback. Test on physical device.

Notes:
- You must run on a real device to feel the Taptic Engine effects.
- Capacitor CLI was added to `devDependencies`; you will need a local native toolchain to continue (Xcode / Android Studio).
- After changing web assets rebuild (`npm run build`) and run `npx cap copy`.
