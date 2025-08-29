/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. ATURAN YANG WAJIB ADA UNTUK GAMBAR DARI BACKEND LOKAL ANDA
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', // Pastikan port ini sesuai dengan backend Anda
        pathname: '/uploads/**',
      },
      
      // 2. Aturan untuk Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },

      // 3. Aturan untuk Imgur (jika Anda masih menggunakannya, misal untuk ikan oranye)
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },

      // Aturan untuk avatar placeholder dari Pravatar
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

// 4. GUNAKAN 'module.exports' UNTUK FILE '.js'
module.exports = nextConfig;