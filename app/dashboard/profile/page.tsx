import { getProfile } from '@/app/actions/user'
import { ProfileForm } from '@/components/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

export default async function ProfilePage() {
  const user = await getProfile()

  if (!user) {
    return <div>Usuário não encontrado</div>
  }

  return (
    <div className="container mx-auto py-4 md:py-10 space-y-4 md:space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Coluna Esquerda: Stats */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sua Reputação</CardTitle>
              <CardDescription>Como os viajantes avaliam você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="text-4xl font-bold">{user.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {user.ratingCount} {user.ratingCount === 1 ? 'avaliação' : 'avaliações'}
                </p>
                
                <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${(user.averageRating / 5) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Form */}
        <div className="w-full md:w-2/3">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}
