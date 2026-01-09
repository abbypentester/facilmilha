'use client'

import { useState } from 'react'
import { rateSeller } from '@/app/actions/flight'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RateSellerDialogProps {
  offerId: string
  sellerName: string
  onRatingSubmitted?: () => void
}

export function RateSellerDialog({ offerId, sellerName, onRatingSubmitted }: RateSellerDialogProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (rating === 0) return
    setLoading(true)
    setError("")
    try {
      await rateSeller(offerId, rating, comment)
      setOpen(false)
      if (onRatingSubmitted) onRatingSubmitted()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Erro ao enviar avaliação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setError("") }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200">
            <Star className="w-4 h-4 mr-2" />
            Avaliar Vendedor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avaliar {sellerName}</DialogTitle>
          <DialogDescription>
            Como foi sua experiência com a emissão da passagem?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-8 h-8",
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <textarea
              id="comment"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Rápido e confiável!"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">
                {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={rating === 0 || loading}>
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}