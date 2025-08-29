// src/lib/apiClient.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Ini adalah fungsi pembantu 'fetch' kita yang baru
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    // Gabungkan URL dasar dengan endpoint spesifik
    const url = `${API_URL}${endpoint}`;

    // Siapkan header default
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Siapkan konfigurasi fetch, selalu sertakan credentials
    const config: RequestInit = {
        ...options,
        headers,
        credentials: 'include', // <-- KUNCI UTAMA
    };

    // Lakukan panggilan fetch
    const response = await fetch(url, config);

    // Tangani respons
    if (!response.ok) {
        // Coba baca pesan error dari body JSON
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message || 'An unknown error occurred.');
    }

    // Jika statusnya 204 (No Content), seperti pada DELETE, kembalikan null
    if (response.status === 204) {
        return null;
    }

    // Jika ada konten, parse sebagai JSON
    return response.json();
};