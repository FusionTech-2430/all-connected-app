/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'standalone',
    images: {
        remotePatterns: ['storage.googleapis.com'],
    },
};

export default nextConfig;
