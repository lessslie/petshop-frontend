/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'http2.mlstatic.com', // <-- agrega este dominio
      // otros dominios que uses, ejemplo:
      // 'res.cloudinary.com', 'firebasestorage.googleapis.com'
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
