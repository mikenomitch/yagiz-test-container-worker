import { DurableObject } from "cloudflare:workers";
import { startAndWaitForPort, proxyFetch } from "./containerHelpers";
import htmlTemplate from "./template";

// Set this to the open port on your container
const OPEN_CONTAINER_PORT = 8080;


export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;

    if (pathname.startsWith("/id/")) {
      let idFromPath = pathname.split("/")[2];
      // In this case, each unique pathname will spawn a new container
      let id = env.MY_CONTAINER.idFromName(idFromPath);
      let stub = env.MY_CONTAINER.get(id);

      stub.setUpMonitoring()

      return await stub.fetch(request);
    }

    if (pathname.startsWith("/status/id/")) {
      let idFromPath = pathname.split("/")[3];
      // In this case, each unique pathname will spawn a new container
      let id = env.MY_CONTAINER.idFromName(idFromPath);
      let stub = env.MY_CONTAINER.get(id);
      let isRunning = stub.getStatus();

      return new Response(`Running? - ${isRunning}`, { status: 200 });
    }

    if (pathname.startsWith("/destroy/id/")) {
      let idFromPath = pathname.split("/")[3];
      // In this case, each unique pathname will spawn a new container
      let id = env.MY_CONTAINER.idFromName(idFromPath);
      let stub = env.MY_CONTAINER.get(id);
      stub.destroySelf()
      return new Response("Container destroyed", { status: 200 });
    }

    if (pathname.startsWith("/signal/id/")) {
      // In this case, each unique pathname will spawn a new container

      let idFromPath = pathname.split("/")[3];
      let signalNumber = pathname.split("/")[4];
      let id = env.MY_CONTAINER.idFromName(idFromPath);
      let stub = env.MY_CONTAINER.get(id);
      stub.signal(signalNumber)
      return new Response(`Container signaled ${signalString}`, { status: 200 });
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

  async destroySelf() {
    await this.ctx.container.destroy("Manually Destroyed");
  }

  async signal(signalString) {
    let signalNumber = parseInt(signalString, 10);
    this.ctx.container.signal(signalNumber);
  }

  getStatus() {
    return this.ctx.container.running;
  }

  setUpMonitoring() {
    // set it up
  }
}
