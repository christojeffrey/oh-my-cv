export default {
    providers: [
        {
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
            issuer: process.env.CLERK_JWT_ISSUER_DOMAIN,
        },
    ],
};
