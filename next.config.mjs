/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'standalone',
    images: {
        domains: ['storage.googleapis.com'],
    },
};

export default nextConfig;
