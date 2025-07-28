
import type {NextConfig} from 'next';

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
  devServer: {
    // Add this to fix the Next.js server constantly restarting in the container.
    // https://nextjs.org/docs/app/api-reference/next-config-js/server-and-client-files-resolution#serverfiles-in-nextconfigjs
    //
    // "When this option is enabled, Next.js will not restart the server when
    // any of these files are changed. This is useful for Docker containers
    // where the file system can be slow to update."
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
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  }
};

export default nextConfig;
