'use client'

import { SectionCard } from '@/components/ui/section-card'
import { FunnelChart } from './FunnelChart'
import { ConversionChart } from './ConversionChart'
import { VelocityChart } from './VelocityChart'

import type { FunnelStage, PartnerConversion } from '../data/constants'
import { DataProvenance } from '@/components/projects/shared/data-provenance'

interface StageConversion {
  stage: string
  conversion: number
  color: string
}

interface ChartsGridProps {
  funnelStages: FunnelStage[]
  winRate: string
  stageConversions: StageConversion[]
  partnerConversion: PartnerConversion[]
}

export function ChartsGrid({
  funnelStages,
  winRate,
  stageConversions,
  partnerConversion,
}: ChartsGridProps) {
  return (
    <>
      {/* Main Funnel Chart wrapped in SectionCard */}
      <SectionCard
        title="Sales Funnel Analysis"
        description="Opportunities by stage from a 2024 partner-program export. These are not the pipeline figures in the case study below."
        className="mb-8"
      >
        <DataProvenance variant="derived" className="mb-4" />
        <FunnelChart stages={funnelStages} winRate={winRate} />
      </SectionCard>

      {/* Conversion Analytics wrapped in SectionCard */}
      <SectionCard
        title="Conversion Analytics"
        description="Stage conversion rates are illustrative; sales velocity is derived from the 2024 partner-program export."
        className="mb-8"
      >
        <DataProvenance variant="illustrative" className="mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConversionChart stageConversions={stageConversions} />
          <VelocityChart partnerConversion={partnerConversion} />
        </div>
      </SectionCard>
    </>
  )
}
