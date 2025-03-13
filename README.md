# Container Worker Starter - Go

This is a basic tempalte to get you started with Containers on Cloudflare's Developer Platform.

Note that this uses Container-enabled Durable Objects and DO-centric config, which may change in the future.

## Steps

1. Make sure you have a Cloudflare token with Workers and Cloudchamber access

2. Clone this repo, and cd into it

3. Use this in-flight branch of Wrangler

`npm install -g https://prerelease-registry.devprod.cloudflare.dev/workers-sdk/prs/8482/npm-package-wrangler-8482`

After running this command, your global wrangler will be overridden!

Confirm you are using this build by running `wrangler --version`.

4. Wrangler deploy

`wrangler deploy`

See the dashboard for status.

5. Access your Worker URL and go use some Containers

### Notes on Setup

* Currently there is an awkward waiting period on your first deploy, we should figure out a nice way to explain this in the dash/first worker code
* If you update container code, you will eventually just `wrangler deploy`, for now you have to:
  * Repush with a new tag
  * Update your wrangler config's `image` field
  * Do a gradual rollout (or just delete your App and make a new one)
