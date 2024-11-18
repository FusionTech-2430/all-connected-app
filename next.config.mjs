/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/v0/b/**',  // Ruta para Firebase Storage
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/**',  // Ruta para Storage API genérica
            }
        ]
    },
};

export default nextConfig;
