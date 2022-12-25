/*
 * SocialExplorer
 * Copyright © 2019-2022 Blue Forest
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { RateLimiter } from "https://deno.land/x/oak_rate_limit/mod.ts"

const app = new Application()

app.use(await RateLimiter({
  windowMs: 1000,
  max: 10,
  headers: true,
  message: "Too many requests, please try again later.",
  statusCode: 429,
  onRateLimit: ctx => {
    console.log("[RATE LIMIT]", ctx.request)
  },
}))

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`)
  await next()
})

const router = new Router()
app.use(router.routes())
app.use(router.allowedMethods())

const envPort = Deno.env.get("PORT")
const port = envPort ? parseInt(envPort) : 3000
console.log(`Listening on http://localhost:${port}`)
await app.listen({ port })
