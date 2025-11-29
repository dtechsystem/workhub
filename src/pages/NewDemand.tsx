import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Wallet, Lock, Calendar, DollarSign, FileText, Send, Clock } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { z } from 'zod';

interface CreatedDemand {
  id: string;
  title: string;
  description: string;
  value: number;
  deadline: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const demandSchema = z.object({
  title: z.string().trim().min(5, 'Título deve ter pelo menos 5 caracteres').max(100, 'Título muito longo'),
  description: z.string().trim().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(1000, 'Descrição muito longa'),
  value: z.number().positive('Valor deve ser positivo').min(10, 'Valor mínimo é R$ 10,00'),
  deadline: z.string().min(1, 'Data de entrega é obrigatória'),
});

export default function NewDemand() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: '',
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDemands, setCreatedDemands] = useState<CreatedDemand[]>([]);

  // Carregar demandas do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('createdDemands');
    if (stored) {
      setCreatedDemands(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = demandSchema.parse({
        title: formData.title,
        description: formData.description,
        value: parseFloat(formData.value),
        deadline: formData.deadline,
      });

      const demandValue = validated.value;

      if (demandValue > (user?.requestBalance || 0)) {
        toast({
          title: 'Saldo insuficiente',
          description: 'Você não possui saldo de solicitação suficiente para esta demanda.',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      // Simula envio
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Criar nova demanda
      const newDemand: CreatedDemand = {
        id: Date.now().toString(),
        title: validated.title,
        description: validated.description,
        value: demandValue,
        deadline: validated.deadline,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Adicionar à lista
      const updatedDemands = [newDemand, ...createdDemands];
      setCreatedDemands(updatedDemands);
      localStorage.setItem('createdDemands', JSON.stringify(updatedDemands));

      toast({
        title: 'Demanda enviada!',
        description: `Sua demanda "${validated.title}" foi enviada para análise. O valor de R$ ${demandValue.toFixed(2)} foi movido para saldo congelado.`,
      });

      // Resetar formulário
      setFormData({
        title: '',
        description: '',
        value: '',
        deadline: '',
      });

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
      setIsSubmitting(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Solicitar Nova Demanda</h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Preencha os dados para criar uma nova solicitação
            </p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-up">
            <MetricCard
              title="Saldo de Solicitação"
              value={`R$ ${(user?.requestBalance ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={Wallet}
              trend="Disponível"
              trendUp
            />
            <MetricCard
              title="Saldo Congelado"
              value={`R$ ${(user?.frozenBalance ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={Lock}
              trend="Aguardando"
            />
          </div>

          {/* Form Card */}
          <Card className="border-border/50 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="border-b border-border/50 bg-card/50 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg lg:text-xl">Dados da Demanda</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Após o envio, o valor será movido para o saldo congelado até a aprovação
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Título da Demanda *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Desenvolvimento de landing page responsiva"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setErrors({ ...errors, title: '' });
                    }}
                    className="text-sm sm:text-base"
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descrição Detalhada *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva os requisitos, tecnologias esperadas e detalhes do projeto..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setErrors({ ...errors, description: '' });
                    }}
                    className="text-sm sm:text-base min-h-[120px]"
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between">
                    {errors.description && (
                      <p className="text-xs sm:text-sm text-destructive">{errors.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {formData.description.length}/1000
                    </p>
                  </div>
                </div>

                {/* Value and Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Value */}
                  <div className="space-y-2">
                    <Label htmlFor="value" className="text-sm sm:text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Valor (R$) *
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      min="10"
                      placeholder="0.00"
                      value={formData.value}
                      onChange={(e) => {
                        setFormData({ ...formData, value: e.target.value });
                        setErrors({ ...errors, value: '' });
                      }}
                      className="text-sm sm:text-base"
                    />
                    {errors.value && (
                      <p className="text-xs sm:text-sm text-destructive">{errors.value}</p>
                    )}
                    {formData.value && parseFloat(formData.value) > (user?.requestBalance || 0) && (
                      <p className="text-xs sm:text-sm text-destructive flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Saldo insuficiente
                      </p>
                    )}
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-sm sm:text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Prazo de Entrega *
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      min={minDateString}
                      value={formData.deadline}
                      onChange={(e) => {
                        setFormData({ ...formData, deadline: e.target.value });
                        setErrors({ ...errors, deadline: '' });
                      }}
                      className="text-sm sm:text-base"
                    />
                    {errors.deadline && (
                      <p className="text-xs sm:text-sm text-destructive">{errors.deadline}</p>
                    )}
                  </div>
                </div>

                {/* Info Alert */}
                <div className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Fluxo de Aprovação
                  </h4>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <li>• O valor será movido para o <Badge variant="outline" className="text-[10px]">Saldo Congelado</Badge></li>
                    <li>• Se recusada, o valor retorna ao Saldo de Solicitação</li>
                    <li>• Se houver contraproposta aceita, os valores serão reajustados</li>
                    <li>• Após aprovação final, o saldo é liberado para uso</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Demanda'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    disabled={isSubmitting}
                    className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Demandas Criadas */}
          {createdDemands.length > 0 && (
            <Card className="border-border/50 shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="border-b border-border/50 bg-card/50 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg lg:text-xl font-bold">Minhas Solicitações</CardTitle>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs uppercase tracking-wider">
                    {createdDemands.length} {createdDemands.length === 1 ? 'Demanda' : 'Demandas'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/30 px-4 lg:px-6 py-2 lg:py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-4">Título</div>
                  <div className="col-span-2">Valor</div>
                  <div className="col-span-2">Prazo</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Data Criação</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-border/50">
                  {createdDemands.map((demand) => (
                    <div
                      key={demand.id}
                      className="transition-all hover:bg-accent/50 cursor-pointer group"
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden p-3 sm:p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm line-clamp-1 flex-1">{demand.title}</span>
                          <Badge 
                            variant={
                              demand.status === 'approved' ? 'default' : 
                              demand.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                            className="text-[10px] flex-shrink-0"
                          >
                            {demand.status === 'pending' && <><Clock className="h-2.5 w-2.5 mr-1" />Pendente</>}
                            {demand.status === 'approved' && 'Aprovada'}
                            {demand.status === 'rejected' && 'Recusada'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-semibold text-green-600">
                            R$ {demand.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span>
                            {new Date(demand.deadline).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4 items-center">
                        {/* Título */}
                        <div className="col-span-4">
                          <span className="truncate font-medium text-sm block">{demand.title}</span>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{demand.description}</p>
                        </div>

                        {/* Valor */}
                        <div className="col-span-2 flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-semibold text-green-600">
                            R$ {demand.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Prazo */}
                        <div className="col-span-2 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(demand.deadline).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <Badge 
                            variant={
                              demand.status === 'approved' ? 'default' : 
                              demand.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {demand.status === 'pending' && <><Clock className="h-3 w-3 mr-1" />Pendente</>}
                            {demand.status === 'approved' && 'Aprovada'}
                            {demand.status === 'rejected' && 'Recusada'}
                          </Badge>
                        </div>

                        {/* Data Criação */}
                        <div className="col-span-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(demand.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border/50 bg-muted/20 px-4 lg:px-6 py-2 lg:py-3 text-center">
                  <button className="text-[10px] sm:text-xs font-medium text-primary hover:underline">
                    Total de {createdDemands.length} {createdDemands.length === 1 ? 'solicitação' : 'solicitações'}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
