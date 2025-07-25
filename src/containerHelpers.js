export async function startAndWaitForPort(
  container,
  portToAwait,
  maxTries = 10
) {
  const port = container.getTcpPort(portToAwait);
  // promise to make sure the container does not exit
  let monitor;

  function onContainerExit() {
    console.log("Container exited");
  }

  // the "err" value can be customized by the destroy() method
  async function onContainerError(err) {
    console.log("Container errored", err);
  }

  for (let i = 0; i < maxTries; i++) {
    try {
      if (!container.running) {
        container.start();
        // force DO to keep track of running state
        monitor = container.monitor().then(onContainerExit).catch(onContainerError);
      }

      await (await port.fetch("http://ping")).text();
      return;
    } catch (err) {
      console.error("Error connecting to the container on", i, "try", err);

      if (err.message.includes("listening")) {
        await new Promise((res) => setTimeout(res, 300));
        continue;
      }

      // no container yet
      if (
        err.message.includes(
          "there is no container instance that can be provided"
        )
      ) {
        await new Promise((res) => setTimeout(res, 300));
        continue;
      }

      throw err;
    }
  }

  throw new Error(
    `could not check container healthiness after ${maxTries} tries`
  );
}

export async function proxyFetch(container, request, portNumber) {
  return await container
    .getTcpPort(portNumber)
    .fetch(request.url.replace("https://", "http://"), request.clone());
}
