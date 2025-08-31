// src/lib/apiClient.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    // 1. Definisikan variabel 'url' dengan benar
    const url = `${API_URL}${endpoint}`;
    
    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt');
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (options.headers) {
        Object.assign(headers, options.headers);
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Hapus 'credentials' karena kita menggunakan metode token
    const config: RequestInit = {
        ...options,
        headers,
    };

    // Lakukan panggilan fetch dengan variabel 'url' yang sudah didefinisikan
    const response = await fetch(url, config);

    // 2. Logika penanganan respons yang lebih kuat
    if (response.status === 204) {
        return null; // Handle No Content
    }

    // Coba parse body sebagai JSON
    const data = await response.json().catch(() => {
        // Jika body kosong atau bukan JSON (seperti saat error 500),
        // jangan crash, lempar error dengan status teks
        throw new Error(response.statusText || `Request failed with status ${response.status}`);
    });
    
    // Jika respons TIDAK ok (misal: 401, 404, 500), lempar error dengan pesan dari server
    if (!response.ok) {
        throw new Error(data.message || 'An unknown API error occurred.');
    }

    return data;
};