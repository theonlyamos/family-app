import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Family Management App',
        short_name: 'Family App',
        description: 'A comprehensive family management application for tracking members, events, dues, and documents',
        start_url: '/dashboard',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/next.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/vercel.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    }
}
