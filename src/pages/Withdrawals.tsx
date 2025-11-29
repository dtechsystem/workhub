import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Wallet, Key, Send, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { z } from 'zod';

interface PixKey {
  id: string;
  type: 'cpf' | 'email' | 'phone' | 'random';
  value: string;
  createdAt: string;
}

interface Withdrawal {
  id: string;
  value: number;
  pixKey: string;
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
}

// Mock data para histórico
const mockWithdrawals: Withdrawal[] = [
  { id: '1', value: 1200, pixKey: '***.456.789-**', status: 'completed', requestedAt: '2024-02-10', completedAt: '2024-02-11' },
  { id: '2', value: 800, pixKey: 'joao@email.com', status: 'pending', requestedAt: '2024-02-14' },
  { id: '3', value: 500, pixKey: '***.456.789-**', status: 'rejected', requestedAt: '2024-01-25' },
  { id: '4', value: 2000, pixKey: '(11) 9****-4321', status: 'completed', requestedAt: '2024-01-15', completedAt: '2024-01-16' },
];

const pixKeySchema = z.object({
  type: z.enum(['cpf', 'email', 'phone', 'random']),
  value: z.string().min(1, 'Chave PIX é obrigatória'),
});

const withdrawalSchema = z.object({
  value: z.number().min(30, 'Valor mínimo é R$ 30,00'),
  pixKeyId: z.string().min(1, 'Selecione uma chave PIX'),
});

export default function Withdrawals() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  
  // Form states
  const [pixForm, setPixForm] = useState({ type: '', value: '' });
  const [withdrawalForm, setWithdrawalForm] = useState({ value: '', pixKeyId: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmittingPix, setIsSubmittingPix] = useState(false);
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  // Load saved PIX keys
  useEffect(() => {
    const stored = localStorage.getItem('pixKeys');
    if (stored) {
      setPixKeys(JSON.parse(stored));
    }
  }, []);

  // Calculate withdrawals this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const withdrawalsThisMonth = withdrawals.filter(w => {
    const date = new Date(w.requestedAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear && w.status !== 'rejected';
  }).length;

  const canWithdraw = withdrawalsThisMonth < 2;
  const remainingWithdrawals = 2 - withdrawalsThisMonth;

  const handleAddPixKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = pixKeySchema.parse({
        type: pixForm.type,
        value: pixForm.value.trim(),
      });

      setIsSubmittingPix(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const newKey: PixKey = {
        id: Date.now().toString(),
        type: validated.type as PixKey['type'],
        value: validated.value,
        createdAt: new Date().toISOString(),
      };

      const updatedKeys = [...pixKeys, newKey];
      setPixKeys(updatedKeys);
      localStorage.setItem('pixKeys', JSON.stringify(updatedKeys));

      toast({
        title: 'Chave PIX cadastrada!',
        description: 'Sua chave PIX foi cadastrada com sucesso.',
      });

      setPixForm({ type: '', value: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmittingPix(false);
    }
  };

  const handleDeletePixKey = (id: string) => {
    const updatedKeys = pixKeys.filter(k => k.id !== id);
    setPixKeys(updatedKeys);
    localStorage.setItem('pixKeys', JSON.stringify(updatedKeys));
    toast({
      title: 'Chave removida',
      description: 'A chave PIX foi removida com sucesso.',
    });
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!canWithdraw) {
      toast({
        title: 'Limite atingido',
        description: 'Você já realizou 2 saques este mês.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const value = parseFloat(withdrawalForm.value);
      const validated = withdrawalSchema.parse({
        value,
        pixKeyId: withdrawalForm.pixKeyId,
      });

      if (validated.value > (user?.balance || 0)) {
        toast({
          title: 'Saldo insuficiente',
          description: 'Você não possui saldo disponível suficiente para este saque.',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmittingWithdrawal(true);
      await new Promise(resolve => setTimeout(resolve, 1200));

      const selectedKey = pixKeys.find(k => k.id === validated.pixKeyId);
      const newWithdrawal: Withdrawal = {
        id: Date.now().toString(),
        value: validated.value,
        pixKey: selectedKey?.value || '',
        status: 'pending',
        requestedAt: new Date().toISOString(),
      };

      setWithdrawals([newWithdrawal, ...withdrawals]);

      toast({
        title: 'Saque solicitado!',
        description: `Seu saque de R$ ${validated.value.toFixed(2)} foi enviado para processamento.`,
      });

      setWithdrawalForm({ value: '', pixKeyId: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  const getPixTypeLabel = (type: string) => {
    switch (type) {
      case 'cpf': return 'CPF';
      case 'email': return 'E-mail';
      case 'phone': return 'Telefone';
      case 'random': return 'Chave Aleatória';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="text-[10px] sm:text-xs"><CheckCircle className="h-3 w-3 mr-1" />Concluído</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-[10px] sm:text-xs"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-[10px] sm:text-xs"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Retiradas 💸</h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Gerencie suas chaves PIX e solicite saques
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-slide-up">
            <MetricCard
              title="Saldo Disponível"
              value={`R$ ${(user?.balance ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={Wallet}
              trend="Para saque"
              trendUp
            />
            <MetricCard
              title="Chaves PIX"
              value={pixKeys.length.toString()}
              icon={Key}
              trend="Cadastradas"
            />
            <MetricCard
              title="Saques Restantes"
              value={`${remainingWithdrawals}/2`}
              icon={Send}
              trend="Este mês"
              trendUp={canWithdraw}
            />
            <MetricCard
              title="Valor Mínimo"
              value="R$ 30,00"
              icon={DollarSign}
              trend="Por saque"
            />
          </div>

          {/* Warning if limit reached */}
          {!canWithdraw && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-center gap-3 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">
                Você já atingiu o limite de 2 saques este mês. Aguarde o próximo mês para solicitar novos saques.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* PIX Keys Section */}
            <Card className="border-border/50 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="border-b border-border/50 bg-card/50 p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Chaves PIX
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Cadastre suas chaves para receber pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Add PIX Key Form */}
                <form onSubmit={handleAddPixKey} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Tipo de Chave</Label>
                      <Select value={pixForm.type} onValueChange={(v) => setPixForm({ ...pixForm, type: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="random">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Chave PIX</Label>
                      <Input
                        placeholder="Digite sua chave"
                        value={pixForm.value}
                        onChange={(e) => setPixForm({ ...pixForm, value: e.target.value })}
                        maxLength={100}
                      />
                      {errors.value && <p className="text-xs text-destructive">{errors.value}</p>}
                    </div>
                  </div>
                  <Button type="submit" size="sm" disabled={isSubmittingPix || !pixForm.type || !pixForm.value}>
                    {isSubmittingPix ? 'Cadastrando...' : 'Cadastrar Chave'}
                  </Button>
                </form>

                {/* PIX Keys List */}
                {pixKeys.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chaves Cadastradas</p>
                    <div className="space-y-2">
                      {pixKeys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                          <div className="flex-1 min-w-0">
                            <Badge variant="outline" className="text-[10px] mb-1">{getPixTypeLabel(key.type)}</Badge>
                            <p className="text-sm font-medium truncate">{key.value}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePixKey(key.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Withdrawal Request Section */}
            <Card className="border-border/50 shadow-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <CardHeader className="border-b border-border/50 bg-card/50 p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Solicitar Saque
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Valor mínimo de R$ 30,00 • Máximo 2 saques/mês
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Valor do Saque (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="30"
                      placeholder="0.00"
                      value={withdrawalForm.value}
                      onChange={(e) => setWithdrawalForm({ ...withdrawalForm, value: e.target.value })}
                      disabled={!canWithdraw}
                    />
                    {errors.value && <p className="text-xs text-destructive">{errors.value}</p>}
                    {withdrawalForm.value && parseFloat(withdrawalForm.value) > (user?.balance || 0) && (
                      <p className="text-xs text-destructive">Saldo insuficiente</p>
                    )}
                    {withdrawalForm.value && parseFloat(withdrawalForm.value) < 30 && parseFloat(withdrawalForm.value) > 0 && (
                      <p className="text-xs text-destructive">Valor mínimo é R$ 30,00</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Chave PIX de Destino</Label>
                    <Select 
                      value={withdrawalForm.pixKeyId} 
                      onValueChange={(v) => setWithdrawalForm({ ...withdrawalForm, pixKeyId: v })}
                      disabled={!canWithdraw || pixKeys.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={pixKeys.length === 0 ? "Cadastre uma chave primeiro" : "Selecione uma chave"} />
                      </SelectTrigger>
                      <SelectContent>
                        {pixKeys.map((key) => (
                          <SelectItem key={key.id} value={key.id}>
                            {getPixTypeLabel(key.type)}: {key.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pixKeyId && <p className="text-xs text-destructive">{errors.pixKeyId}</p>}
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      • Saques são processados em até 24h úteis<br />
                      • Você pode realizar no máximo 2 saques por mês<br />
                      • O valor será debitado do seu saldo disponível
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={
                      !canWithdraw || 
                      isSubmittingWithdrawal || 
                      pixKeys.length === 0 || 
                      !withdrawalForm.value || 
                      !withdrawalForm.pixKeyId ||
                      parseFloat(withdrawalForm.value) < 30 ||
                      parseFloat(withdrawalForm.value) > (user?.balance || 0)
                    }
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmittingWithdrawal ? 'Solicitando...' : 'Solicitar Saque'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal History */}
          <Card className="border-border/50 shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="border-b border-border/50 bg-card/50 p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Histórico de Saques</CardTitle>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {withdrawals.length} transações
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/30 px-4 lg:px-6 py-2 lg:py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-2">Data</div>
                <div className="col-span-4">Chave PIX</div>
                <div className="col-span-3">Valor</div>
                <div className="col-span-3">Status</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-border/50">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="transition-all hover:bg-accent/50"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden p-3 sm:p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm truncate flex-1">{withdrawal.pixKey}</span>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          R$ {withdrawal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span>
                          {new Date(withdrawal.requestedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4 items-center">
                      {/* Data */}
                      <div className="col-span-2 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          {new Date(withdrawal.requestedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Chave PIX */}
                      <div className="col-span-4">
                        <span className="truncate font-medium text-sm block">{withdrawal.pixKey}</span>
                      </div>

                      {/* Valor */}
                      <div className="col-span-3 flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-sm">
                          R$ {withdrawal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-3">
                        {getStatusBadge(withdrawal.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 bg-muted/30 px-4 lg:px-6 py-3 text-xs text-muted-foreground">
                Mostrando {withdrawals.length} transações
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
