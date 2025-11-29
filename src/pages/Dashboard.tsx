import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CertificationsList } from '@/components/dashboard/CertificationsList';
import { DemandsInbox } from '@/components/dashboard/DemandsInbox';
import { Wallet, Clock, Briefcase, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockTodayOffers } from '@/data/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Olá, {user?.name}! 👋</h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Confira suas métricas e demandas de hoje
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4 animate-slide-up">
            <MetricCard
              title="Saldo Disponível"
              value={`R$ ${user?.balance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}`}
              icon={Wallet}
              trend="+12.5%"
              trendUp
            />
            <MetricCard
              title="Saldo Pendente"
              value={`R$ ${user?.pendingBalance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}`}
              icon={Clock}
              trend="3 pagamentos"
            />
            <MetricCard
              title="Ofertas de Hoje"
              value={mockTodayOffers}
              icon={Briefcase}
              trend="+2 novas"
              trendUp
            />
            <MetricCard
              title="XP Total"
              value={`${user?.xp.toLocaleString('pt-BR')} XP`}
              icon={Trophy}
              trend="Nível 5"
            />
          </div>

          {/* Content Grid */}
          <div className="space-y-4 sm:space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CertificationsList />
            <DemandsInbox />
          </div>
        </div>
      </main>
    </div>
  );
}
