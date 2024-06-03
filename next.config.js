/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/python/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/python/:path*"
                        : "/python/",
            },
            {
                source: "/docs",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/docs"
                        : "/python/docs",
            },
            {
                source: "/openapi.json",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/openapi.json"
                        : "/python/openapi.json",
            },
        ];
    },
}

module.exports = nextConfig
