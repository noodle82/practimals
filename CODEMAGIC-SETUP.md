# Spelloids: GitHub → Codemagic → TestFlight

Use this guide with the v10 files. The earlier website package alone cannot create an Apple build. This version includes a Capacitor iPhone/iPad wrapper, app icon, pinned dependencies and the root codemagic.yaml workflow. Codemagic creates the native Xcode project on its Mac; you do not need to upload a hidden .github folder.

Confirmed Bundle ID: **com.spelloids.spelling**. App name: **Spelloids**. Initial app version: **0.10.0**.

## 1. Upload the files to GitHub

Extract spelloids-v10-github-upload.zip. Upload its contents to the top level of your existing repository, replacing matching files. Do not upload the ZIP itself or an enclosing folder. You should see codemagic.yaml, capacitor.config.json, package.json and package-lock.json alongside index.html.

GitHub's browser upload accepts limited files per batch. Upload root files first, then audio, fonts, vendor, scripts, native and tests in separate batches, retaining their folder names. Every supplied file is smaller than 25 MiB. Do not upload node_modules or dist. The build includes only the current audio bank and ignores obsolete audio/engine files left from older website uploads.

## 2. Connect GitHub to Codemagic

Sign in at https://codemagic.io/ and choose Add application → GitHub. Authorise Codemagic and install the Codemagic CI/CD GitHub App. Select Only select repositories and grant access to your Spelloids repository. Select that repository and choose the Ionic/Capacitor project type if offered; use Other if the interface has no matching option. This project uses codemagic.yaml, not Flutter's visual workflow editor.

Source: https://docs.codemagic.io/getting-started/adding-apps/

## 3. Check the Apple app record

You need active Apple Developer Program membership and an App Store Connect app record with the same Bundle ID. An App ID in Certificates, Identifiers & Profiles is separate from the record under App Store Connect → My Apps → + → New App. Select iOS, your registered com.spelloids.spelling identifier and your chosen app name. SPELLOIDS001 is a suitable SKU if you have not already created the record. Keep an existing record/SKU.

## 4. Connect Apple to Codemagic

In App Store Connect → Users and Access → Integrations → App Store Connect API, create a dedicated team API key named Codemagic with App Manager access. The account may first need API access enabled by its Account Holder. Download the .p8 key when offered: Apple permits that download once. Keep the Issuer ID and Key ID.

In Codemagic → Team settings → Team integrations → Developer Portal → Manage keys → Add key, enter those IDs and upload the .p8 file. **Name this Codemagic integration spelloids-apple**, matching the workflow. Upload the private key directly there. It does not belong in GitHub or a chat.

Source: https://docs.codemagic.io/yaml-code-signing/signing-ios/

## 5. Add distribution signing

Open Codemagic → Team settings → codemagic.yaml settings → Code signing identities → iOS certificates. Generate an Apple Distribution certificate using your Apple integration, download it and follow Codemagic's instructions to add the resulting certificate to its signing identities. Keep an existing suitable certificate if already configured.

In Apple Developer → Certificates, Identifiers & Profiles → Profiles → +, create a distribution profile of type App Store Connect for **com.spelloids.spelling**, selecting that distribution certificate. Name it Spelloids App Store and generate it. Back in Codemagic's signing identities → iOS provisioning profiles, fetch that profile from Apple or upload the downloaded .mobileprovision file. It must be an App Store profile for this exact Bundle ID and certificate; a development or ad hoc profile will not work for this workflow.

Codemagic's YAML selects matching signing assets by distribution type and Bundle ID. No private signing values are stored in the repository. Refer to the signing guide above if a screen label differs.

## 6. Run the build

Select your application's branch, usually main, and the **Spelloids iOS TestFlight** workflow. Start the build. It installs the locked packages, runs the tests, builds the web assets, creates/synchronises the native project, applies signing, creates an .ipa and uploads it to App Store Connect.

The build number uses Codemagic's increasing project counter plus one. If you have already uploaded a higher number, set the non-secret environment variable IOS_BUILD_NUMBER to a new, higher positive integer before starting this build. Reusing a number for the same app version is rejected by Apple.

If signing fails, check the integration name, Bundle ID, certificate and profile. If the upload fails, inspect the publishing log and any Apple email. A green compilation alone does not prove the upload succeeded. The .ipa should also appear among the Codemagic build artifacts.

Sources: https://docs.codemagic.io/yaml-quick-start/building-an-ionic-app/ and https://docs.codemagic.io/yaml-publishing/app-store-connect/

## 7. Start external Beta App Review

Wait for Apple's processing, then open App Store Connect → your app → TestFlight. Complete the beta description, feedback email and Beta App Review contact information. Answer any export-compliance questions accurately; the source declares no non-exempt encryption and uses normal platform transport/storage and file hashing. Create an internal group first if requested by Apple's interface. A processed eligible build can be tested internally by your App Store Connect team without waiting for external Beta App Review.

Create an external group, add the processed build and submit it for Beta App Review. **This workflow uploads the build but does not automatically submit either external beta review or public App Store review.** Uploading alone does not start the beta review clock. Share tester invitations or a public TestFlight link once approved. Apple does not promise a fixed 24-hour turnaround.

Suggested review notes: “Spelloids is spelling practice for children. No login is required. A 15-word example is included. For Grown-ups settings, the answer to the gate is 29. Children earn their first badge by choosing to learn, then confirm a name, shape and voice. Practice uses the assigned list. All voice/model files are bundled locally. Parent-entered new words generate on the device.”

Source: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/

## What has been verified here

Web tests, browser behaviour, audio assets, build configuration, native template paths and the app icon are checked locally. This Windows workspace cannot run Xcode, sign an Apple build or validate behaviour on a physical iPad. Your first Codemagic build is the macOS compile/sign/upload check; a successful TestFlight install is the device check. Nothing has been uploaded to Apple or published to GitHub by this package.
