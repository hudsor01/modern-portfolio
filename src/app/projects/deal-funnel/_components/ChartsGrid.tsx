'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ChartContainer } from '@/components/ui/chart-container'
import { FunnelChart } from './FunnelChart'
import { ConversionChart } from './ConversionChart'
import { VelocityChart } from './VelocityChart'

import type { FunnelStage, PartnerConversion } from '../data/constants'

interface StageConversion {
  stage: string
  conversion: number
  color: string
}

interface ChartsGridProps {
  funnelStages: FunnelStage[]
  overallConversionRate: string
  stageConversions: StageConversion[]
  partnerConversion: PartnerConversion[]
}

export function ChartsGrid({
  funnelStages,
  overallConversionRate,
  stageConversions,
  partnerConversion,
}: ChartsGridProps) {
  return (
    <>
      {/* Main Funnel Chart wrapped in SectionCard */}
      <SectionCard
        title="Sales Funnel Analysis"
        description="Visual representation of deal progression through each stage of the sales pipeline"
        className="mb-8"
      >
        <ChartContainer
          title="Deal Stage Funnel"
          description={`Overall conversion rate: ${overallConversionRate}%`}
          height={400}
        >
          <FunnelChart stages={funnelStages} overallConversionRate={overallConversionRate} />
        </ChartContainer>
      </SectionCard>

      {/* Conversion Analytics wrapped in SectionCard */}
      <SectionCard
        title="Conversion Analytics"
        description="Detailed analysis of stage-to-stage conversion rates and sales velocity"
        className="mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer
            title="Stage Conversion Rates"
            description="Conversion rates between each stage of the sales funnel"
            height={350}
          >
            <ConversionChart stageConversions={stageConversions} />
          </ChartContainer>
          <ChartContainer
            title="Sales Velocity by Partner"
            description="Average sales cycle duration across different partner channels"
            height={350}
          >
            <VelocityChart partnerConversion={partnerConversion} />
          </ChartContainer>
        </div>
      </SectionCard>
    </>
  )
}
