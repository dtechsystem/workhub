import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCertifications } from '@/data/mockData';
import { Award, Sparkles } from 'lucide-react';

export const CertificationsList = () => {
  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-4 w-4 text-primary" />
          Certificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {mockCertifications.map((cert, index) => (
            <div
              key={cert.id}
              className="shine-effect certification-glow relative inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 px-3 py-1.5 transition-all hover:border-primary/60 hover:scale-105 cursor-pointer group"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Icon with glow */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <span className="relative text-sm filter drop-shadow-lg">{cert.icon}</span>
              </div>

              {/* Name */}
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                {cert.name}
              </span>

              {/* Sparkle */}
              <Sparkles className="h-2.5 w-2.5 text-primary/60 animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
