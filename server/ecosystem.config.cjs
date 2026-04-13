module.exports = {
  apps: [{
    name: 'layers-api',
    script: 'src/index.js',
    cwd: '/var/www/layers/server',
    interpreter: 'node',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'postgresql://layers:Layers2026@localhost:5432/layers',
      JWT_SECRET: 'b7e9ddac4b53fa2e464b02e744868bbd45460c5fadc340e4cf629b96f72c3e96',
      PRINTIFY_SHOP_ID: '27136321',
      PRINTIFY_API_TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjEwMGQyNmE5NTQ2YjJjYjhlODVkNTU2OGFhYjQ5NjlkZTAyOGU0NWU5OGVlMWM1N2E0MjI2YTI2MTNjMzhmNzRmMjkwYzM2NzFlZDA0YzA4IiwiaWF0IjoxNzc1OTExNjIwLjE2MzQ1NywibmJmIjoxNzc1OTExNjIwLjE2MzQ1OCwiZXhwIjoxODA3NDQ3NjIwLjE1NzI2OCwic3ViIjoiMjY5MzIxNDYiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.jlsASpurqLSxJVCqvC79DfSrmq2ulOpSvHfT_2fT3o52rFE5MKfGv889kG4oj0k6arjuckF8OMCjx8DGUqlZcJjMFtoJb6bX3k8uhj_pwnKuH0DG34565hnJTdqJnOZLGb4RQNDtrxjWTGva6-e2-9lSMIi3hsnQB66GPXrPstU_j19Je8gwHMHvpzZjwNx3P_g7zMx2iXGJU3ep4TNvBKARV75dZwpKDGVND-QJLLhQuwTqdoQJPfUqXfQrKOE6ezNeyy4UJQfT-ALQO69Iy6tLigI5o-whXjhqbXPaQeva5rHVMtbD2C3XfyWzQIEuwFalyA0c-02x078uzcQs2-blJYtmDNxRLZd8yk5Bm346teQDgx9-3uZmkGMUYg62LCNiit8BZpvYiLlpBLbcTHsaWJO0yBSdiKmVizA0iBfLyjT7pNQW2yV_gXgZxiaqrlI7ZL651GnFlSTYYMDJ6N118d9retIOfeA6EsLdLnhM-bCfwP_Qs9I_2k3eTydYqgSsUN3N7jeLkc-LOKAV5oeC8V7bScMQRG8Bg2Vhw2sBQlbywCQp_fzqn2Lw7MbALUtKayix7NjeXksWnmZ5xOQIuXsnE7VRuzK1roSBvyilNbj4y9Av60P0PvsdkPoBEylnwTYIC7uDnKLmvOsvsjp9GxZbpGf6A6ln5dqUScc',
      STRIPE_SECRET_KEY: 'sk_test_placeholder',
      STRIPE_WEBHOOK_SECRET: 'whsec_placeholder'
    }
  }]
}
