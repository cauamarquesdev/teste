import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(start: string, end: string) {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        procedure: true,
      },
    });
  }

  async create(data: any) {
    // 1. Busca o tenant padrão ou o primeiro cadastrado
    let tenant = await this.prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: { name: 'Clínica Principal' },
      });
    }

    // 2. Valida se o paciente real existe
    const patientExists = await this.prisma.patient.findUnique({
      where: { id: data.patientId },
    });
    if (!patientExists) {
      throw new NotFoundException('Paciente não encontrado no banco de dados.');
    }

    // 3. Pega um profissional padrão caso não venha selecionado
    let professionalId = data.professionalId;
    if (!professionalId) {
      const defaultUser = await this.prisma.user.findFirst({
        where: { tenantId: tenant.id },
      });
      if (!defaultUser) {
        throw new NotFoundException(
          'Nenhum profissional/usuário cadastrado no sistema.',
        );
      }
      professionalId = defaultUser.id;
    }

    // 4. Pega um procedimento padrão caso não venha selecionado
    let procedureId = data.procedureId;
    if (!procedureId) {
      let defaultProcedure = await this.prisma.procedure.findFirst({
        where: { tenantId: tenant.id },
      });
      if (!defaultProcedure) {
        defaultProcedure = await this.prisma.procedure.create({
          data: {
            name: data.procedureName || 'Consulta / Avaliação',
            duration: 30,
            price: 150.0,
            tenantId: tenant.id,
          },
        });
      }
      procedureId = defaultProcedure.id;
    }

    // 5. Cria o agendamento real amarrando todas as chaves estrangeiras
    return this.prisma.appointment.create({
      data: {
        date: new Date(data.date || data.start),
        status: data.status || 'AGENDADO',
        tenantId: tenant.id,
        patientId: data.patientId, // ID real do paciente
        professionalId: professionalId, // ID real do usuário/médico
        procedureId: procedureId, // ID real do procedimento
      },
      include: {
        patient: true,
        procedure: true,
      },
    });
  }
}
