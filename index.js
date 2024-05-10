import Fastify from "fastify";
import authRoutes from "./routes/auth.js";
import userManageRoute from "./routes/admin/userManage.js";
import dabasePlugin from "./fastifyPlugin/database.js";
import cors from "@fastify/cors";
const fastify = Fastify({ logger: true });
const db = fastify.register(dabasePlugin);
await fastify.register(cors, {
  origin: `https://deorwine-kuldeep-q5ix-gzm1yjyf0.vercel.app/`,
});
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
const port = process.env.PORT || 4000
fastify.listen(port, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});
