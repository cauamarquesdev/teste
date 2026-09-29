import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const birthDate = data.birthDate ? new Date(data.birthDate) : null;

    return this.prisma.patient.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        hasWhatsapp: data.hasWhatsapp ?? true,
        active: data.active ?? true,
        birthDate,

        tenant: {
          connect: {
            id: data.tenantId,
          },
        },
      },
    });
  }

  async findAll(search?: string) {
    return this.prisma.patient.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                cpf: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                phone: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient;
  }

  async update(id: string, data: any) {
    await this.findOne(id);

    let parsedBirthDate;

    if (data.birthDate !== undefined) {
      parsedBirthDate = data.birthDate ? new Date(data.birthDate) : null;
    }

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.cpf !== undefined && {
          cpf: data.cpf,
        }),

        ...(data.phone !== undefined && {
          phone: data.phone,
        }),

        ...(data.email !== undefined && {
          email: data.email,
        }),

        ...(data.hasWhatsapp !== undefined && {
          hasWhatsapp: data.hasWhatsapp,
        }),

        ...(data.active !== undefined && {
          active: data.active,
        }),

        ...(data.birthDate !== undefined && {
          birthDate: parsedBirthDate,
        }),
      },
    });
  }

  async toggleStatus(id: string, active: boolean) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: { active },
    });
  }

  async deleteBatch(ids: string[]) {
    return this.prisma.patient.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
