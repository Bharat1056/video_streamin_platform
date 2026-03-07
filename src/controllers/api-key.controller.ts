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

  @Get()
  @ApiOperation({ summary: 'List all API Keys' })
  async listAllApiKeys(@Req() req: any) {
    return this.apiKeyService.listApiKeys(req.user.id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke (delete) an API Key' })
  async deleteApiKey(@Req() req: any) {
    return this.apiKeyService.deleteApiKey(req.user.id)
  }

  @Post(':id/regenerate')
  @ApiOperation({ summary: 'Regenerate an API Key' })
  async regenerateApiKey(@Req() req: any, @Param('id') id: string) {
    return this.apiKeyService.regenerateApiKey(req.user.id, id)
  }

}
