import { DurableObject } from "cloudflare:workers";
import { startAndWaitForPort, proxyFetch } from "./containerHelpers";

// Set this to the open port on your container
const OPEN_CONTAINER_PORT = 8080;

// If you are load balancing over several instances,
// set this to the number you want to have live
const INSTANCES_TO_LOAD_BALANCE_TO = 3;

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

export default {
  async fetch(request, env, ctx) {
    const pathname = new URL(request.url).pathname;

    // If you wish to route requests to a specific container,
    // pass a container identifier to .get()
    if (pathname.startsWith("/specific/")) {
      // In this case, each unique pathname with spawn a new container
      let id = env.MY_CONTAINER.idFromName(pathname);
      let stub = env.MY_CONTAINER.get(id);
      return await stub.fetch(request);
    }

    // If you wish to route to one of several containers interchangeably,
    // use one of N random IDs
    if (pathname.startsWith("/lb")) {
      let randomID = Math.floor(Math.random() * INSTANCES_TO_LOAD_BALANCE_TO);
      let id = env.MY_CONTAINER.idFromName("lb-" + randomID);
      let stub = env.MY_CONTAINER.get(id);
      return await stub.fetch(request);
    }

    const html = `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: monospace; max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #eee; }
    .route { color: #d33; font-weight: bold; }
  </style>
</head>
<body>
  This is a Container-enabled Worker.<br>Route to <span class="route">/specific/:container-id</span> to spin up a new container.<br>Route to <span class="route">/lb</span> to load balance across multiple.
</body>
</html>
`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
      },
    });
  },
};
