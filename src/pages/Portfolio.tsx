import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { mockCompletedProjects } from '@/data/mockData';

export default function Portfolio() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalEarnings = mockCompletedProjects.reduce((sum, project) => sum + project.value, 0);
  const averageRating = (
    mockCompletedProjects.reduce((sum, project) => sum + project.rating, 0) / 
    mockCompletedProjects.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold">Meu Portfólio</h2>
            <p className="mt-2 text-muted-foreground">
              Projetos concluídos e feedbacks dos clientes
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCompletedProjects.length}</div>
                <p className="text-xs text-muted-foreground">Total de entregas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Valor total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {averageRating}
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">De {mockCompletedProjects.length} projetos</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {mockCompletedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all flex flex-col">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2">{project.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shrink-0 text-xs">
                      ✓
                    </Badge>
                  </div>
                  
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={project.clientAvatar} alt={project.client} />
                      <AvatarFallback className="text-xs">
                        {project.client.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{project.client}</span>
                  </CardDescription>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < project.rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <p className="text-xs text-muted-foreground line-clamp-3">{project.description}</p>

                  <Separator />

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="font-medium">{project.completedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-green-600">
                        R$ {project.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {project.feedback && (
                    <>
                      <Separator />
                      <div className="rounded-lg bg-muted/50 p-2 flex-1">
                        <p className="text-xs italic text-muted-foreground line-clamp-3">
                          "{project.feedback}"
                        </p>
                      </div>
                    </>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
