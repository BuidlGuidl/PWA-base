# 🏗 Scaffold-ETH 2 PWA 📱

## 🏃 Quick Start

To get started with Scaffold-ETH 2, follow the steps below:

1 . Clone this repo & install dependencies

```bash
gh repo clone BuidlGuidl/PWA-burner-wallet
cd PWA-burner-wallet
yarn install
```

2 . Setting up firebase

> Note : You can also use other database as well, we are using firebase for this example checkout `packages/nextjs/database/firebase`

Copy `packages/nextjs/.env.example` into `packages/nextjs/.env` file and fill in your firebase credentials which starts with `FB`

Checkout [this article](https://softauthor.com/add-firebase-to-javascript-web-app/#add-firebase-sdk-to-javascript-web-app) on how to get config variables from firebase. We use this in our `packages/nextjs/database/firebase/config` file :

```js
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STRG_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
};
```

> Note : Make sure you have read and write [rules](https://firebase.google.com/docs/firestore/security/get-started#testing_rules) allowed

3 . Setting VAPID Keys

set `PUBLIC_KEY_VAPID` , `PRIVATE_KEY_VAPID` => `packages/nextjs/.env`

`NEXT_PUBLIC_PUBLIC_KEY_VAPID` => `packages/nextjs/.env.local`

Run the following command to generate Public and Private VAPID :

```bash
yarn web-push-generate
```

4 . Starting the app

```bash
yarn start
```

> Note: You can disable dev server logs by uncommenting line `disable: process.env.NODE_ENV=== "development"`

### Important files

1. We have extended [`next-pwa`](https://github.com/shadowwalker/next-pwa) default service-worker at `packages/worker/index.ts`

2. Logic for subscription for push notification is present in `packages/nextjs/utils/service-workers/index.ts`

3. All the push backend routes are present in `packages/nextjs/pages/api/push`

### Resources

1. [The service worker lifecycle](https://web.dev/service-worker-lifecycle/)

2. [next-pwa](https://github.com/shadowwalker/next-pwa)

3. [Google's Push Notification's series](https://web.dev/push-notifications-overview/)
