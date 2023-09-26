⚠️ This is a work in progress.

# 🏗 Scaffold-ETH 2 PWA 📱

This **forkable** project provides the infraestructure to build a Progressive Web App (PWA) using Scaffold-ETH 2 base features, plus PWA oriented extra features, like Push Notifications and the capability to Install the PWA on your device.

To learn more about base Scaffold-ETH 2 features and development guide, check our [Docs](https://docs.scaffoldeth.io/) and [Website](https://scaffoldeth.io/).

## 🏃 Quick Start

To get started with Scaffold-ETH 2 PWA, follow the steps below:

### 1 . Clone this repo & install dependencies

```bash
gh repo clone BuidlGuidl/PWA-burner-wallet
cd PWA-burner-wallet
yarn install
```

### 2 . Setting up Firebase

> Note : You can also use other database as well, we are using Firebase for this example checkout `packages/nextjs/database/firebase`.

Copy `packages/nextjs/.env.example` into `packages/nextjs/.env.local` file and fill in your Firebase credentials which starts with `FIREBASE`.

Checkout [this article](https://softauthor.com/add-firebase-to-javascript-web-app/#add-firebase-sdk-to-javascript-web-app) on how to get config variables from Firebase.

> Hint: If it's your first time using Firebase, please read the article from the beginning, as you'll need to create a Firebase project and register a web app first.

We use the Firebase config variables in our `packages/nextjs/database/firebase/config` file:

```js
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STRG_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
```

> Hint : Make sure you have read and write [rules](https://firebase.google.com/docs/firestore/security/get-started#testing_rules) allowed in Firebase.

### 3 . Setting VAPID Keys

VAPID keys are a public-private key pair used to securely identify the server sending web push notifications.

Run the following command to generate Public and Private VAPID :

```bash
yarn web-push-generate
```

Set `NEXT_PUBLIC_PUBLIC_KEY_VAPID` and `PRIVATE_KEY_VAPID` variables in `packages/nextjs/.env.local` file.

### 4 . Starting the PWA

To set up your local environment and start the PWA, run the following commands in different terminal windows:

1. In the first terminal, start your local network (a blockchain emulator in your computer):

```bash
yarn chain
```

2. In a second terminal window, deploy your contract (locally):

```bash
yarn deploy
```

3. In a third terminal window, start your PWA:

```bash
yarn start
```

Visit your web app on: `http://localhost:3000`.

> Note: You can disable dev server logs by uncommenting line `disable: process.env.NODE_ENV=== "development"` in `packages/nextjs/next.config.mjs` file.

### 5 . Testing notification on local

1. Install the PWA from Chrome web browser.

2. Open the PWA, click _"Allow Notification"_ button => This will ask for permission & register the subscription in DB.

3. Once its successful you will see _"Notify All"_ button => This button makes "POST" request to `packages/nextjs/pages/api/push/notify-all.ts` which will send notification to all the subscribers

### 6 . Deploying your PWA to Vercel

> Hint: We recommend connecting your GitHub repo to Vercel (through the Vercel UI) so it gets automatically deployed when pushing to main.

To deploy directly from the CLI, run this and follow the steps to deploy to Vercel:

```
yarn vercel
```

Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run:

```
yarn vercel --prod
```

#### 6.1 . Setting Environment Variables

When you deploy to Vercel you have to set all the environment variables from your `packages/nextjs/.env.local` file into your Vercel Environment Variables section.

You can do this in the Vercel Project dashboard under _"Settings > Environment Variables"_.

> Hint: You can mass copy all the config variables from your `packages/nextjs/.env.local` config files and paste them into the Vercel form.

![VercelEnvironmentVariables](https://github.com/BuidlGuidl/PWA-burner-wallet/assets/55535804/8d1a56cf-a7c0-4ebe-8949-18673d6542e7)

## Development and References

### Important Development files

1. We have extended [`next-pwa`](https://github.com/shadowwalker/next-pwa) default service-worker at `packages/worker/index.ts`

2. Logic for subscription for push notification is present in `packages/nextjs/utils/service-workers/index.ts`

3. All the push backend routes are present in `packages/nextjs/pages/api/push`

### Scaffold ETH 2 Documentation

To learn more about Scaffold-ETH 2 features and development guide, you can check out the [Scaffold-ETH 2 Docs](https://docs.scaffoldeth.io/).

### Extra Resources

1. [The service worker lifecycle](https://web.dev/service-worker-lifecycle/)

2. [next-pwa](https://github.com/shadowwalker/next-pwa)

3. [Google's Push Notification's series](https://web.dev/push-notifications-overview/)
