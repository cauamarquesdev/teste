import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  // Cria um Lead e já abre uma Oportunidade no funil
  async createOpportunity(data: {
    leadName: string;
    phone: string;
    source?: string;
    title: string;
    value?: number;
    userId: string;
  }) {
    const prisma = this.prisma as any;

    return prisma.lead.create({
      data: {
        name: data.leadName,
        phone: data.phone,
        source: data.source,
        opportunities: {
          create: {
            title: data.title,
            value: data.value,
            userId: data.userId,
            stage: 'NOVO_CONTATO',
          },
        },
      },
      include: { opportunities: true },
    });
  }

  // Move o card de coluna no Kanban
  async updateOpportunityStage(opportunityId: string, newStage: string) {
    const prisma = this.prisma as any;

    return prisma.opportunity.update({
      where: { id: opportunityId },
      data: { stage: newStage },
    });
  }

  // Retorna todas as oportunidades organizadas para o Kanban
  async getKanbanBoard() {
    const prisma = this.prisma as any;

    return prisma.opportunity.findMany({
      include: { lead: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
