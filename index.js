import Fastify from "fastify";
import authRoutes from "./routes/auth.js";
import userManageRoute from "./routes/admin/userManage.js";
import dabasePlugin from "./fastifyPlugin/database.js";
import { fastifyCors } from "@fastify/cors"; // Import the specific function from fastify-cors

const fastify = Fastify({ logger: true });
const db = fastify.register(dabasePlugin);
const corsOptions = {
  origin: "*",
  methods: ["OPTIONS", "GET", "DELETE", "POST", "PUT", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "authorization",
    "Accept-Encoding",
"token",
  ],
  optionsSuccessStatus: 200,
  exposedHeaders: "Content-Disposition",
};

// Use import instead of require
fastify.register(fastifyCors, corsOptions);

authRoutes.forEach((route) => {
  const base_path = "/api/v4/user";
  route.url = base_path + route.url;
  console.log(route);
  fastify.route(route);
});

userManageRoute.forEach((route) => {
  const base_path = "/api/v4/admin/";
  route.url = base_path + route.url;
  console.log(route);
  fastify.route(route);
});

console.log({
  ...process.env,
});

const port = process.env.PORT || 4000;

// Starting the server
fastify.listen(port, "0.0.0.0", (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});
