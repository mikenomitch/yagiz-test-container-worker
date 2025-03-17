import { DurableObject } from "cloudflare:workers";
import {
  startAndWaitForPort,
  proxyFetch,
  loadBalance,
} from "./containerHelpers";
import htmlTemplate from "./template";

// Set this to the open port on your container
const OPEN_CONTAINER_PORT = 8080;

// If you are load balancing over several instances,
// set this to the number you want to have live
const LB_INSTANCES = 3;

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;

    // If you wish to route requests to a specific container,
    // pass a container identifier to .get()

    if (pathname.startsWith("/specific/")) {
      // In this case, each unique pathname will spawn a new container
      let id = env.MY_CONTAINER.idFromName(pathname);
      let stub = env.MY_CONTAINER.get(id);
      return await stub.fetch(request);
    }

    // If you wish to route to one of several containers interchangeably,
    // use one of N random IDs

    if (pathname.startsWith("/lb")) {
      let container = await loadBalance(env.MY_CONTAINER, LB_INSTANCES);
      return await container.fetch(request);
    }

    // Serve the homepage if not routing to a container
    return new Response(htmlTemplate, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  },
};

export class MyContainer extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      await startAndWaitForPort(ctx.container, OPEN_CONTAINER_PORT);
    });
  }

  async fetch(request) {
    return await proxyFetch(this.ctx.container, request, OPEN_CONTAINER_PORT);
  }
}
