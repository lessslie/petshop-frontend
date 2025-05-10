/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.purina.com.bo",
      "piensoymascotas.com",
      "www.mercadolibre.com.ar",
      "http2.mlstatic.com",
      // agrega aquí otros dominios de imágenes externas que uses
    ],
  },
};

module.exports = nextConfig;
