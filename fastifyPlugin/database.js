import fp from "fastify-plugin";
import executeQuery from "../database/index.js";

export default fp(async (fastify, opts) => {
  fastify.decorate("executeQuery", executeQuery);
});
