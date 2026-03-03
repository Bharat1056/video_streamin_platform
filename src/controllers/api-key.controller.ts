import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiKeyService } from 'src/services/api-key.service';


@Controller('api-keys')
@ApiTags('API Keys')
@ApiBearerAuth()
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new API Key' })
  async createApiKey(@Req() req: any) {
    return this.apiKeyService.createApiKey(req.user.id)
  }
}
