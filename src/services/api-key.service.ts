import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { eq, and, count } from 'drizzle-orm'
import { NeonDatabase } from 'drizzle-orm/neon-serverless'
import * as crypto from 'crypto'
import * as argon2 from 'argon2'

import { DRIZZLE_DB } from 'src/database/database.module'
import { api_key } from 'src/database/schema'
import * as schema from 'src/database/schema'

const MAX_API_KEYS_LIMIT = 5

@Injectable()
export class ApiKeyService {
  constructor (
    @Inject(DRIZZLE_DB)
    private readonly db: NeonDatabase<typeof schema>
  ) {}

  private generateKey(): { plainTextKey: string, keyId: string } {

    const keyId = crypto.randomUUID().replace(/-/g, "") // it replace all hyphen into ""(empty) string for ex: 550e8400-e29b-41d4-a716-446655440000 -> 550e8400e29b41d4a716446655440000

    const secret = crypto.randomBytes(32).toString('base64url') // generate a random 32 bytes (256 bits) and then parse this into URL safe base64 format

    const plainTextKey = `VMX_${keyId}_${secret}`

    return { plainTextKey, keyId }

  }

  async createApiKey(userId: string) {
    // Ensure max 5 keys limit
    // TODO: Future we will add plan based API keys
    const [ result ] = await this.db.select({ count: count() }).from(api_key).where(eq(api_key.user_id, userId))

    if (result.count >= MAX_API_KEYS_LIMIT) {
      throw new BadRequestException(`You have reached the maximum limi of ${MAX_API_KEYS_LIMIT} API keys. Please contact support for more.`)
    }

    const { plainTextKey, keyId } = this.generateKey()

    const hash = await argon2.hash(plainTextKey, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 1 << 16,
      parallelism: 1
    })

    const prefix = plainTextKey.substring(0, 18) + "...";

    await this.db.insert(api_key).values({
      id: keyId,
      user_id: userId,
      prefix,
      value: hash,
    })

    return { key: plainTextKey }

  }

  async listApiKeys(userId: string) {

  }

  async deleteApiKey(userId: string) {

  }

  async regenerateApiKey(userId: string, id: string) {

  }
}
