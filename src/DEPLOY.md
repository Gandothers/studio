# Deploying Your Application

This guide provides instructions for deploying your Next.js application to the web for free.

## Firebase App Hosting (Recommended)

Your project is already configured for easy deployment on Firebase App Hosting, which has a generous free tier suitable for many applications.

The deployment process is mostly automated once you connect your code repository.

### Managing API Keys and Secrets

It is critical that you **never** commit your API keys directly into your code repository. Your app is already set up to use environment variables, which is the correct and secure way to handle secrets.

-   **For local development**: You can create a file named `.env` in the root of your project and add your key like this: `GOOGLE_API_KEY=your_api_key_here`. This file is ignored by source control and is only for your local machine.
-   **For production deployment on Firebase**: You must provide your key to Firebase securely.

**Step-by-step instructions for deployment:**

1.  **Push to GitHub:** Make sure all your latest code is pushed to a repository on GitHub.

2.  **Go to the Firebase Console:** Open the Firebase Console for your project in your web browser.

3.  **Navigate to App Hosting:** In the left-hand menu under the "Build" section, find and click on **App Hosting**.

4.  **Create a Backend:** Click the **"Create backend"** button.

5.  **Connect Your Repository:** Follow the on-screen prompts to connect Firebase to your GitHub account and select the repository for this project.

6.  **Add Your API Key:**
    *   Once your backend is created, stay on the App Hosting page.
    *   Look for a section or tab related to **"Secrets"** or **"Environment Variables"**.
    *   Click to add a new secret.
    *   Enter `GOOGLE_API_KEY` as the **Name** or **Key**.
    *   Paste your actual Google AI API key into the **Value** field.
    *   Save the secret.

7.  **Deploy:** Firebase will automatically build your application using your repository and securely inject the `GOOGLE_API_KEY` you just saved. Once it's finished, you will be given a public URL where you can access your live application.

That's it! From now on, every time you push a change to your main branch on GitHub, Firebase App Hosting will automatically redeploy the new version for you, always using the secure key you saved.

## Alternative: Vercel

Vercel, the company behind Next.js, also offers a fantastic free hosting platform. The process is similar: you would add your `GOOGLE_API_KEY` in the "Environment Variables" section of your project settings in the Vercel dashboard.

1.  Sign up for a Vercel account and connect it to your GitHub account.
2.  From the Vercel dashboard, click **"Add New... > Project"**.
3.  Import your project's repository from GitHub.
4.  In the project settings, find "Environment Variables", and add your `GOOGLE_API_KEY`.
5.  Vercel will automatically detect that it's a Next.js project and configure the build settings for you.
6.  Click **"Deploy"**. Vercel will build and deploy your site, providing you with a public URL.
