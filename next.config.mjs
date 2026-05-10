import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'www.mundoxxi.com' },
      { protocol: 'https', hostname: 'mundoxxi.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
