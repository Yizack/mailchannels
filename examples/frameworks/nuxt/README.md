# Examples: Nuxt + MailChannels

In this folder, you can find full-stack examples of how to use MailChannels with Nuxt.

## Getting Started

Follow these steps to set up the Nuxt + MailChannels example:

### 1. Create .env File

Copy the `.env.example` file to `.env` and fill in your MailChannels API key:

```sh
cp .env.example .env
```

### 2. Install Dependencies

Install the required dependencies using your package manager:

```sh
# npm
npm install

# yarn
yarn install

# pnpm
pnpm i
```

### 3. Run the Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

## Pages

- `/` - Home page listing all examples
- `/send` - Send a predefined email using the API route

## API Routes

- `POST /api/send` - API route to send a predefined email using MailChannels
