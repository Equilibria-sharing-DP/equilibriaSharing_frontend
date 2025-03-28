import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.pexels.com", "t4.ftcdn.net", "img.freepik.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
