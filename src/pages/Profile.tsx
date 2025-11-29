import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, MapPin, Star, ThumbsUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockReviews } from '@/data/mockData';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    stack: user?.stack || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso.',
    });
  };

  const handleImageUpload = (type: 'avatar' | 'cover') => {
    toast({
      title: 'Em desenvolvimento',
      description: `Upload de ${type === 'avatar' ? 'foto' : 'capa'} será implementado em breve.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Cover Image */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-background">
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-4 right-4"
                onClick={() => handleImageUpload('cover')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Alterar capa
              </Button>
            </div>
            
            {/* Profile Header */}
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-12">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-card ring-2 ring-primary/20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() => handleImageUpload('avatar')}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 pt-16 sm:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {user?.location || 'Localização não informada'}
                      </p>
                    </div>
                    <Button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                      {isEditing ? 'Salvar alterações' : 'Editar perfil'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column - Edit Form */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Mantenha suas informações atualizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stack">Stack / Especialização</Label>
                    <Input
                      id="stack"
                      value={formData.stack}
                      onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ex: Full Stack Developer, UI/UX Designer..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ex: São Paulo, SP"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Resumo Profissional</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Conte um pouco sobre sua experiência e objetivos profissionais..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    Avaliações
                  </CardTitle>
                  <CardDescription>
                    Feedback de clientes e parceiros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.avatar} alt={review.author} />
                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{review.author}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-13">{review.comment}</p>
                      <div className="flex items-center gap-4 pl-13">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {review.helpful}
                        </Button>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats & Certifications */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">XP Total</span>
                    <Badge variant="secondary">{user?.xp} XP</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avaliação</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Projetos</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificações</CardTitle>
                  <CardDescription>Suas qualificações validadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['React Advanced', 'Node.js Professional', 'AWS Certified'].map((cert) => (
                      <div key={cert} className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          ✓
                        </Badge>
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
