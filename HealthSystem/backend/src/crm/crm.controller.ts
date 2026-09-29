import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CrmService } from './crm.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('oportunidade')
  async createOpp(@Body() data: any, @Request() req: any) {
    // Injeta automaticamente o ID do usuário que está logado criando o card
    return this.crmService.createOpportunity({
      ...data,
      userId: req.user.sub,
    });
  }

  @Patch('oportunidade/:id/etapa')
  async moveStage(@Param('id') id: string, @Body('stage') stage: string) {
    return this.crmService.updateOpportunityStage(id, stage);
  }

  @Get('kanban')
  async getBoard() {
    return this.crmService.getKanbanBoard();
  }
}
