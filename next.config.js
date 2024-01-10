/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/ecommerce",
    assetPrefix: "/ecommerce",
    webpack(config, { isServer }) {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false
            };
        }
        return config;
    }
}

module.exports = nextConfig
