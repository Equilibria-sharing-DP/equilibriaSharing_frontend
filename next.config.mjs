import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "t4.ftcdn.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.freepik.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
