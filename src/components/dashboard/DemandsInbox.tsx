import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockDemands } from '@/data/mockData';
import { ChevronRight, Calendar, DollarSign, User, FileText, AlertCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

const statusLabels = {
  pending: 'Pendente',
  'in-progress': 'Enviada',
  completed: 'Paga',
  review: 'Em revisão',
};

const priorityColors = {
  low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  medium: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

type Demand = typeof mockDemands[0];

const counterProposalSchema = z.object({
  reason: z.string().trim().min(10, 'Motivo deve ter pelo menos 10 caracteres').max(500, 'Motivo muito longo'),
  newValue: z.number().positive('Valor deve ser positivo').min(1, 'Valor mínimo é R$ 1,00'),
  newDeadline: z.string().min(1, 'Data de entrega é obrigatória'),
});

export const DemandsInbox = () => {
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCounterProposal, setShowCounterProposal] = useState(false);
  const [counterProposal, setCounterProposal] = useState({
    reason: '',
    newValue: '',
    newDeadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDemandClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsModalOpen(true);
    setShowCounterProposal(false);
    setCounterProposal({ reason: '', newValue: '', newDeadline: '' });
    setErrors({});
  };

  const handleAcceptDemand = () => {
    if (!selectedDemand) return;

    toast({
      title: 'Demanda aceita!',
      description: `Você aceitou a demanda "${selectedDemand.title}"`,
    });
    setIsModalOpen(false);
  };

  const handleRejectDemand = () => {
    if (!selectedDemand) return;

    toast({
      title: 'Demanda recusada',
      description: `Você recusou a demanda "${selectedDemand.title}"`,
      variant: 'destructive',
    });
    setIsModalOpen(false);
  };

  const handleSubmitCounterProposal = () => {
    if (!selectedDemand) return;

    try {
      const validated = counterProposalSchema.parse({
        reason: counterProposal.reason,
        newValue: parseFloat(counterProposal.newValue),
        newDeadline: counterProposal.newDeadline,
      });

      toast({
        title: 'Contraproposta enviada!',
        description: `Sua contraproposta para "${selectedDemand.title}" foi enviada com sucesso.`,
      });
      
      setIsModalOpen(false);
      setShowCounterProposal(false);
      setCounterProposal({ reason: '', newValue: '', newDeadline: '' });
      setErrors({});
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
    }
  };

  return (
    <>
      <Card className="border-border/50 shadow-card overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-card/50 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-bold">Oportunidades Recentes</CardTitle>
            <Badge variant="secondary" className="text-[10px] sm:text-xs uppercase tracking-wider">
              Live Feed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border/50 bg-muted/30 px-4 lg:px-6 py-2 lg:py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-3">Remetente</div>
            <div className="col-span-4">Assunto</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Data</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border/50">
            {mockDemands.map((demand) => (
              <div
                key={demand.id}
                onClick={() => handleDemandClick(demand)}
                className={`transition-all hover:bg-accent/50 cursor-pointer group ${
                  demand.unread ? 'bg-primary/5' : ''
                }`}
              >
                {/* Mobile Layout */}
                <div className="md:hidden p-3 sm:p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {demand.unread && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                      )}
                      <span className="truncate font-medium text-sm">{demand.client}</span>
                    </div>
                    <Badge className={`${statusColors[demand.status]} text-[10px] flex-shrink-0`}>
                      {statusLabels[demand.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{demand.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(demand.deadline).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4">
                  {/* Remetente */}
                  <div className="col-span-3 flex items-center gap-2">
                    {demand.unread && (
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                    )}
                    <span className="truncate font-medium text-sm">{demand.client}</span>
                  </div>

                  {/* Assunto */}
                  <div className="col-span-4 flex items-center">
                    <span className="truncate text-sm text-muted-foreground">{demand.title}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <Badge className={`${statusColors[demand.status]} text-xs`}>
                      {statusLabels[demand.status]}
                    </Badge>
                  </div>

                  {/* Data */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(demand.deadline).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-1 flex items-center justify-end">
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 bg-muted/20 px-4 lg:px-6 py-2 lg:py-3 text-center">
            <button className="text-[10px] sm:text-xs font-medium text-primary hover:underline">
              Ver todas as oportunidades ({mockDemands.length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Demand Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="truncate">{selectedDemand?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Detalhes da oportunidade
            </DialogDescription>
          </DialogHeader>

          {selectedDemand && (
            <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
              {/* Client Info */}
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Cliente</p>
                  <p className="font-medium text-sm truncate">{selectedDemand.client}</p>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-lg bg-muted/50">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={`${statusColors[selectedDemand.status]} text-[10px] sm:text-xs`}>
                    {statusLabels[selectedDemand.status]}
                  </Badge>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-muted/50">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Prioridade</p>
                  <Badge className={`${priorityColors[selectedDemand.priority]} text-[10px] sm:text-xs`}>
                    <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    {priorityLabels[selectedDemand.priority]}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Descrição</p>
                <p className="text-xs sm:text-sm">{selectedDemand.description}</p>
              </div>

              {/* Value and Deadline */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Valor</p>
                    <p className="font-bold text-green-500 text-sm sm:text-base truncate">
                      R$ {selectedDemand.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Prazo</p>
                    <p className="font-medium text-sm truncate">
                      {new Date(selectedDemand.deadline).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions or Counter Proposal Form */}
              {!showCounterProposal ? (
                <div className="space-y-2 pt-1 sm:pt-2">
                  <Button 
                    onClick={handleAcceptDemand}
                    className="w-full text-xs sm:text-sm h-9 sm:h-10"
                  >
                    Aceitar Demanda
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowCounterProposal(true)}
                      variant="outline" 
                      className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                    >
                      Enviar Contraproposta
                    </Button>
                    <Button 
                      onClick={handleRejectDemand}
                      variant="destructive" 
                      className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                    >
                      Recusar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1 sm:pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between pt-3">
                    <h3 className="text-sm sm:text-base font-semibold">Enviar Contraproposta</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setShowCounterProposal(false);
                        setCounterProposal({ reason: '', newValue: '', newDeadline: '' });
                        setErrors({});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="reason" className="text-xs sm:text-sm">
                        Motivo da Contraproposta *
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="Explique o motivo da sua contraproposta..."
                        value={counterProposal.reason}
                        onChange={(e) => {
                          setCounterProposal({ ...counterProposal, reason: e.target.value });
                          setErrors({ ...errors, reason: '' });
                        }}
                        className="mt-1 text-xs sm:text-sm min-h-[80px]"
                        maxLength={500}
                      />
                      {errors.reason && (
                        <p className="text-[10px] sm:text-xs text-destructive mt-1">{errors.reason}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <Label htmlFor="newValue" className="text-xs sm:text-sm">
                          Novo Valor (R$) *
                        </Label>
                        <Input
                          id="newValue"
                          type="number"
                          step="0.01"
                          min="1"
                          placeholder="0.00"
                          value={counterProposal.newValue}
                          onChange={(e) => {
                            setCounterProposal({ ...counterProposal, newValue: e.target.value });
                            setErrors({ ...errors, newValue: '' });
                          }}
                          className="mt-1 text-xs sm:text-sm"
                        />
                        {errors.newValue && (
                          <p className="text-[10px] sm:text-xs text-destructive mt-1">{errors.newValue}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="newDeadline" className="text-xs sm:text-sm">
                          Nova Data *
                        </Label>
                        <Input
                          id="newDeadline"
                          type="date"
                          value={counterProposal.newDeadline}
                          onChange={(e) => {
                            setCounterProposal({ ...counterProposal, newDeadline: e.target.value });
                            setErrors({ ...errors, newDeadline: '' });
                          }}
                          className="mt-1 text-xs sm:text-sm"
                        />
                        {errors.newDeadline && (
                          <p className="text-[10px] sm:text-xs text-destructive mt-1">{errors.newDeadline}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        onClick={handleSubmitCounterProposal}
                        className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                      >
                        Enviar Contraproposta
                      </Button>
                      <Button
                        onClick={() => {
                          setShowCounterProposal(false);
                          setCounterProposal({ reason: '', newValue: '', newDeadline: '' });
                          setErrors({});
                        }}
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
