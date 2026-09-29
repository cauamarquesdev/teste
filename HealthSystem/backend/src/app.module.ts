import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgendaModule } from './agenda/agenda.module';
import { SalesModule } from './sales/sales.module';
import { FinanceModule } from './finance/finance.module';
import { MedicalRecordModule } from './medical-record/medical-record.module';
import { CrmModule } from './crm/crm.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrismaService } from './prisma/prisma.service';
import { AppointmentsService } from './appointments/appointments.service';
import { AgendaService } from './agenda/agenda.service';
import { AgendaController } from './agenda/agenda.controller';
import { AppointmentsController } from './appointments/appointments.controller';
import { PatientsController } from './patients/patients.controller';
import { PatientsService } from './patients/patients.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AgendaModule,
    SalesModule,
    FinanceModule,
    MedicalRecordModule,
    CrmModule,
    PatientsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
