import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, TrendingUp, TrendingDown, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data para gráficos
const dailyData = [
  { name: 'Seg', entrada: 400, saida: 240 },
  { name: 'Ter', entrada: 300, saida: 139 },
  { name: 'Qua', entrada: 200, saida: 980 },
  { name: 'Qui', entrada: 278, saida: 390 },
  { name: 'Sex', entrada: 189, saida: 480 },
  { name: 'Sab', entrada: 239, saida: 380 },
  { name: 'Dom', entrada: 349, saida: 430 },
];

const weeklyData = [
  { name: 'Sem 1', entrada: 4000, saida: 2400 },
  { name: 'Sem 2', entrada: 3000, saida: 1398 },
  { name: 'Sem 3', entrada: 2000, saida: 9800 },
  { name: 'Sem 4', entrada: 2780, saida: 3908 },
];

const monthlyData = [
  { name: 'Jan', entrada: 12000, saida: 8400 },
  { name: 'Fev', entrada: 9000, saida: 6398 },
  { name: 'Mar', entrada: 15000, saida: 7800 },
  { name: 'Abr', entrada: 8780, saida: 5908 },
  { name: 'Mai', entrada: 11890, saida: 4800 },
  { name: 'Jun', entrada: 14390, saida: 6800 },
];

// Mock data para extrato
const mockTransactions = [
  { id: '1', date: '2024-02-15', description: 'Pagamento - Dashboard Analytics', value: 3500, status: 'completed', type: 'entrada' },
  { id: '2', date: '2024-02-14', description: 'Saque realizado', value: -1200, status: 'completed', type: 'saida' },
  { id: '3', date: '2024-02-12', description: 'Pagamento - API E-commerce', value: 2800, status: 'completed', type: 'entrada' },
  { id: '4', date: '2024-02-10', description: 'Pagamento - Landing Page', value: 1200, status: 'pending', type: 'entrada' },
  { id: '5', date: '2024-02-08', description: 'Saque realizado', value: -800, status: 'completed', type: 'saida' },
  { id: '6', date: '2024-02-05', description: 'Bônus de indicação', value: 250, status: 'completed', type: 'entrada' },
  { id: '7', date: '2024-02-03', description: 'Pagamento - App Mobile', value: 5000, status: 'completed', type: 'entrada' },
  { id: '8', date: '2024-02-01', description: 'Taxa de serviço', value: -150, status: 'completed', type: 'saida' },
];

type PeriodType = 'daily' | 'weekly' | 'monthly';

export default function Statement() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodType>('daily');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getChartData = () => {
    switch (period) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const filteredTransactions = mockTransactions.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const totalEntrada = mockTransactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.value, 0);
  const totalSaida = mockTransactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + Math.abs(t.value), 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Extrato Financeiro</h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Acompanhe suas movimentações financeiras
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-slide-up">
            <MetricCard
              title="Saldo Disponível"
              value={`R$ ${(user?.balance ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={Wallet}
              trend="+12.5%"
              trendUp
            />
            <MetricCard
              title="Total Entradas"
              value={`R$ ${totalEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              trend="Este mês"
              trendUp
            />
            <MetricCard
              title="Total Saídas"
              value={`R$ ${totalSaida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={TrendingDown}
              trend="Este mês"
            />
            <MetricCard
              title="Saldo Pendente"
              value={`R$ ${(user?.pendingBalance ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={Calendar}
              trend="3 pagamentos"
            />
          </div>

          {/* Charts Section */}
          <Card className="border-border/50 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="border-b border-border/50 bg-card/50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-base sm:text-lg">Movimentações</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={period === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('daily')}
                  >
                    Diário
                  </Button>
                  <Button
                    variant={period === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('weekly')}
                  >
                    Semanal
                  </Button>
                  <Button
                    variant={period === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('monthly')}
                  >
                    Mensal
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="h-[250px] sm:h-[300px]">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Entradas vs Saídas</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="entrada" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="saida" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="h-[250px] sm:h-[300px]">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Volume por Período</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="entrada" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="saida" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="border-border/50 shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="border-b border-border/50 bg-card/50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg">Extrato Completo</CardTitle>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    {filteredTransactions.length} transações
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="completed">Concluídos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/30 px-4 lg:px-6 py-2 lg:py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-2">Data</div>
                <div className="col-span-5">Descrição</div>
                <div className="col-span-3">Valor</div>
                <div className="col-span-2">Status</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-border/50">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="transition-all hover:bg-accent/50 cursor-pointer group"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden p-3 sm:p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm line-clamp-1 flex-1">{transaction.description}</span>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className="text-[10px] flex-shrink-0"
                        >
                          {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className={`font-semibold flex items-center gap-1 ${transaction.value > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {transaction.value > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          R$ {Math.abs(transaction.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span>
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4 items-center">
                      {/* Data */}
                      <div className="col-span-2 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Descrição */}
                      <div className="col-span-5">
                        <span className="truncate font-medium text-sm block">{transaction.description}</span>
                      </div>

                      {/* Valor */}
                      <div className="col-span-3 flex items-center gap-1.5">
                        {transaction.value > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`font-semibold text-sm ${transaction.value > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          R$ {Math.abs(transaction.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className="text-[10px] sm:text-xs"
                        >
                          {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 bg-muted/30 px-4 lg:px-6 py-3 text-xs text-muted-foreground">
                Mostrando {filteredTransactions.length} de {mockTransactions.length} transações
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
