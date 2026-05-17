interface ScoreInput {
  time_on_proposal: number
  sections_visited: string[]
  coverage_interactions: number
  cta_clicks: number
  return_visits: number
  scroll_depth: number
}

const WEIGHTS = {
  time: 0.25,
  sections: 0.20,
  interactions: 0.20,
  cta: 0.20,
  returns: 0.10,
  scroll: 0.05,
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val))
}

export function computeConversionScore(input: ScoreInput): number {
  const timeScore = clamp((input.time_on_proposal / 300) * 100)
  const sectionScore = clamp((input.sections_visited.length / 5) * 100)
  const interactionScore = clamp((input.coverage_interactions / 10) * 100)
  const ctaScore = input.cta_clicks > 0 ? 100 : 0
  const returnScore = clamp(input.return_visits * 33)
  const scrollScore = clamp(input.scroll_depth)

  const score =
    timeScore * WEIGHTS.time +
    sectionScore * WEIGHTS.sections +
    interactionScore * WEIGHTS.interactions +
    ctaScore * WEIGHTS.cta +
    returnScore * WEIGHTS.returns +
    scrollScore * WEIGHTS.scroll

  return Math.round(clamp(score))
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Hot Lead'
  if (score >= 60) return 'Engajado'
  if (score >= 40) return 'Interessado'
  if (score >= 20) return 'Visitou'
  return 'Frio'
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#e84d3d'
  if (score >= 60) return '#f97316'
  if (score >= 40) return '#f59e0b'
  if (score >= 20) return '#3b82f6'
  return '#71717a'
}
