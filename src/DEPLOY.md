# Deploying Your Application

This guide provides instructions for deploying your Next.js application to the web for free.

## Firebase App Hosting (Recommended)

Your project is already configured for easy deployment on Firebase App Hosting, which has a generous free tier suitable for many applications.

The deployment process is mostly automated once you connect your code repository.

**Step-by-step instructions:**

1.  **Push to GitHub:** Make sure all your latest code is pushed to a repository on GitHub.

2.  **Go to the Firebase Console:** Open the Firebase Console for your project in your web browser.

3.  **Navigate to App Hosting:** In the left-hand menu under the "Build" section, find and click on **App Hosting**.

4.  **Create a Backend:** Click the **"Create backend"** button.

5.  **Connect Your Repository:** Follow the on-screen prompts to connect Firebase to your GitHub account and select the repository for this project.

6.  **Deploy:** Firebase will automatically build your application from your repository and deploy it. Once it's finished, you will be given a public URL where you can access your live application.

That's it! From now on, every time you push a change to your main branch on GitHub, Firebase App Hosting will automatically redeploy the new version for you.

## Alternative: Vercel

Vercel, the company behind Next.js, also offers a fantastic free hosting platform.

1.  Sign up for a Vercel account and connect it to your GitHub account.
2.  From the Vercel dashboard, click **"Add New... > Project"**.
3.  Import your project's repository from GitHub.
4.  Vercel will automatically detect that it's a Next.js project and configure the build settings for you.
5.  Click **"Deploy"**. Vercel will build and deploy your site, providing you with a public URL.
