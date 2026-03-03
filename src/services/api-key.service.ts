import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { eq, and, count } from 'drizzle-orm'
import { DRIZZLE_DB } from 'src/database/database.module'


@Injectable()
export class ApiKeyService {
  constructor (
    @Inject(DRIZZLE_DB) private readonly db: any
  ) {}

  async createApiKey(userId: string) {

  }
}
