
import type {NextConfig} from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      // Since we are using a mono-repo, we need to allow all files to be
      // loaded by the server.
      allowedForwardedHosts: ['localhost'],
    },
    // This is necessary to prevent the server from restarting when files are
    // changed in the container.
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
};

export default withPWA(nextConfig);
