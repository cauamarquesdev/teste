var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
let FinanceService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FinanceService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FinanceService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        // Registra uma nova conta a pagar ou a receber
        async createTransaction(data) {
            const financialTransaction = this.prisma.financialTransaction;
            return financialTransaction.create({
                data: {
                    ...data,
                    paymentDate: data.status === 'PAGO' ? new Date() : null,
                },
            });
        }
        // Busca o extrato completo com filtros (DRE simplificado)
        async getTransactions(month, year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            const financialTransaction = this.prisma.financialTransaction;
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
        async getDashboardSummary(month, year) {
            const transactions = await this.getTransactions(month, year);
            let totalIncomes = 0;
            let totalExpenses = 0;
            let pendingReceivables = 0;
            let pendingPayables = 0;
            transactions.forEach((t) => {
                const amount = Number(t.amount);
                if (t.type === 'RECEITA') {
                    if (t.status === 'PAGO')
                        totalIncomes += amount;
                    else
                        pendingReceivables += amount;
                }
                else if (t.type === 'DESPESA') {
                    if (t.status === 'PAGO')
                        totalExpenses += amount;
                    else
                        pendingPayables += amount;
                }
            });
            return {
                balance: totalIncomes - totalExpenses,
                totalIncomes,
                totalExpenses,
                pendingReceivables,
                pendingPayables,
            };
        }
    };
    return FinanceService = _classThis;
})();
export { FinanceService };
