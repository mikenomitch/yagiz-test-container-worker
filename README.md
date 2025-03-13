# Container Worker Starter - Go

This is a basic tempalte to get you started with Containers on Cloudflare's Developer Platform.

Note that this uses Container-enabled Durable Objects and DO-centric config, which may change in the future.

## Steps

1. Make sure you have a Cloudflare token with Workers and Cloudchamber access

2. Clone this repo, and cd into it

3. Use this in-flight branch of Wrangler

`npm install -g https://prerelease-registry.devprod.cloudflare.dev/workers-sdk/prs/8476/npm-package-wrangler-8476`

After running this command, your global wrangler will be overridden!

Confirm you are using this build by running `wrangler --version`.

4. Build and push the image

`wrangler cloudchamber build -p -t container-starter-go:1.0 .`

**note: this will be part of `wrangler deploy` if you have a Dockerfile specified**

4. Wrangler deploy

`wrangler deploy`

5. Get the namespace ID from the namespace that was created when you deployed

6. Paste the namespace ID into wrangler.toml in the namespace_id field

```
[containers.durable_objects]
namespace_id = "<YOUR-NAMESPACE-ID-HERE>"
```

7. Create your container app

`wrangler cloudchamber apply`

8. Wait for your containers to be deployed

See the dashboard for status.

9. Access your Worker