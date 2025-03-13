export async function startAndWaitForPort(container, portToAwait) {
  if (!container.running) {
    container.start();
  }

  const port = container.getTcpPort(portToAwait);
  for (let i = 0; i < 1000; i++) {
    try {
      await port.fetch("http://10.0.0.1/");
      await new Promise((res) => setTimeout(res, 300));
      break;
    } catch (err) {
      console.log("err message", err.message);
      console.error(err);
      if (err.message.includes("listening")) {
        await new Promise((res) => setTimeout(res, 100));
        continue;
      }

      throw err;
    }
  }
}

export async function proxyFetch(container, request, portNumber) {
  return await container
    .getTcpPort(portNumber)
    .fetch(request.url.replace("https://", "http://"), request.clone());
}
