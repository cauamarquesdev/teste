import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // Registra uma nova conta a pagar ou a receber
  async createTransaction(data: {
    description: string;
    amount: number;
    type: string;
    status: string;
    dueDate: Date;
    category: string;
    paymentMethod?: string;
    saleId?: string;
  }) {
    const financialTransaction = (
      this.prisma as unknown as {
        financialTransaction: any;
      }
    ).financialTransaction;

    return financialTransaction.create({
      data: {
        ...data,
        paymentDate: data.status === 'PAGO' ? new Date() : null,
      },
    });
  }

  // Busca o extrato completo com filtros (DRE simplificado)
  async getTransactions(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const financialTransaction = (
      this.prisma as unknown as {
        financialTransaction: any;
      }
    ).financialTransaction;

    return financialTransaction.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  // Calcula os totais para os Cards do Dashboard
  async getDashboardSummary(month: number, year: number) {
    const transactions = await this.getTransactions(month, year);

    let totalIncomes = 0;
    let totalExpenses = 0;
    let pendingReceivables = 0;
    let pendingPayables = 0;

    transactions.forEach(
      (t: { amount: unknown; type: string; status: string }) => {
        const amount = Number(t.amount);
        if (t.type === 'RECEITA') {
          if (t.status === 'PAGO') totalIncomes += amount;
          else pendingReceivables += amount;
        } else if (t.type === 'DESPESA') {
          if (t.status === 'PAGO') totalExpenses += amount;
          else pendingPayables += amount;
        }
      },
    );

    return {
      balance: totalIncomes - totalExpenses,
      totalIncomes,
      totalExpenses,
      pendingReceivables,
      pendingPayables,
    };
  }
}
