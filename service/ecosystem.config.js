const { PORTS, ENVS } = require('@ebazdev/core');

module.exports = {
  apps: [
    {
      name: "customer",
      script: "./build/index.js",
      instances: 1,
      exec_mode: "cluster",
      env_development: {
        NODE_ENV: "development",
        PORT: PORTS.DEV.Customer,
        NATS_CLIENT_ID: process.env.PM2_INSTANCE_ID ? `customer-service-${process.env.PM2_INSTANCE_ID}` : 'customer-service',
        ...ENVS.DEV
      },
      env_stag: {
        NODE_ENV: "stag",
        PORT: PORTS.STAG.Customer,
        NATS_CLIENT_ID: process.env.PM2_INSTANCE_ID ? `customer-service-${process.env.PM2_INSTANCE_ID}` : 'customer-service',
        ...ENVS.STAG
      },
      env_production: {
        NODE_ENV: "production",
        PORT: PORTS.DEV.Product,
        NATS_CLIENT_ID: process.env.PM2_INSTANCE_ID ? `customer-service-${process.env.PM2_INSTANCE_ID}` : 'customer-service',
        ...ENVS.PROD
      },
    },
  ],
};