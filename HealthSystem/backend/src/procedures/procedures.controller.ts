import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('procedures')
class ProceduresController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.procedure.findMany();
  }
}
