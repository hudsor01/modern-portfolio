'use client'

import { useState } from 'react'
import { ArrowRight, Folder, FileText, Mail, MapPin } from 'lucide-react'

const palettes = {
  A: {
    name: 'Executive Slate',
    description: 'McKinsey/Bain consultancy elegance',
    bg: 'bg-stone-50',
    text: 'text-stone-900',
    primary: 'bg-teal-600',
    primaryText: 'text-teal-600',
    accent: 'text-amber-700',
    muted: 'text-stone-500',
    cardBg: 'bg-white',
    border: 'border-stone-200',
    primaryHex: '#0D9488',
    accentHex: '#B45309',
    textHex: '#1C1917',
    mutedHex: '#78716C',
  },
  B: {
    name: 'Modern Finance',
    description: 'Stripe/Linear SaaS professional',
    bg: 'bg-white',
    text: 'text-slate-900',
    primary: 'bg-indigo-600',
    primaryText: 'text-indigo-600',
    accent: 'text-emerald-600',
    muted: 'text-slate-500',
    cardBg: 'bg-slate-50',
    border: 'border-slate-200',
    primaryHex: '#4F46E5',
    accentHex: '#059669',
    textHex: '#0F172A',
    mutedHex: '#64748B',
  },
  C: {
    name: 'Warm Professional',
    description: 'Approachable consultant, human warmth',
    bg: 'bg-amber-50',
    text: 'text-stone-800',
    primary: 'bg-orange-700',
    primaryText: 'text-orange-700',
    accent: 'text-green-700',
    muted: 'text-stone-400',
    cardBg: 'bg-white',
    border: 'border-amber-200',
    primaryHex: '#C2410C',
    accentHex: '#15803D',
    textHex: '#292524',
    mutedHex: '#A8A29E',
  },
  D: {
    name: 'Tech Forward',
    description: 'Notion/Figma tech-savvy',
    bg: 'bg-slate-50',
    text: 'text-slate-950',
    primary: 'bg-blue-600',
    primaryText: 'text-blue-600',
    accent: 'text-violet-600',
    muted: 'text-slate-400',
    cardBg: 'bg-white',
    border: 'border-slate-200',
    primaryHex: '#2563EB',
    accentHex: '#7C3AED',
    textHex: '#020617',
    mutedHex: '#94A3B8',
  },
}

type PaletteKey = keyof typeof palettes

function FullPagePreview({ paletteKey, onBack }: { paletteKey: PaletteKey; onBack: () => void }) {
  const p = palettes[paletteKey]

  return (
    <div className={`min-h-screen ${p.bg}`}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 right-4 z-50 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        ← Back to All
      </button>

      {/* Nav */}
      <nav className={`border-b px-8 py-4 ${p.border} ${p.cardBg}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className={`text-xl font-bold ${p.text}`}>RH</span>
          <div className="flex gap-8">
            {['Projects', 'Resume', 'Blog', 'Contact'].map((item) => (
              <span key={item} className={`cursor-pointer ${p.muted} hover:opacity-80`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="px-8 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className={`mb-4 text-sm font-medium uppercase tracking-widest ${p.accent}`}>
            Revenue Operations Professional
          </p>
          <h1 className={`mb-6 text-xl font-bold leading-tight ${p.text}`}>
            Richard Hudson
          </h1>
          <p className={`mx-auto mb-12 max-w-2xl text-xl leading-relaxed ${p.muted}`}>
            Experienced Revenue Operations professional with proven track record of delivering{' '}
            <span className={`font-semibold ${p.primaryText}`}>$4.8M+</span>{' '}
            revenue impact through strategic operational improvements, data-driven insights, and scalable process optimization.
          </p>

          {/* Stats */}
          <div className="mx-auto mb-12 grid max-w-3xl grid-cols-4 gap-6">
            {[
              { value: '$4.8M+', label: 'Revenue Impact' },
              { value: '432%', label: 'Growth Achieved' },
              { value: '2,217%', label: 'Network Expansion' },
              { value: '10+', label: 'Years Experience' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-6 ${p.cardBg} ${p.border}`}
              >
                <div className={`mb-1 text-xl font-bold ${p.primaryText}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${p.muted}`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <button
              className={`flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white ${p.primary} hover:opacity-90`}
            >
              <Folder size={20} />
              View Projects
              <ArrowRight size={18} />
            </button>
            <button
              className={`flex items-center gap-2 rounded-xl border-2 px-8 py-4 text-lg font-semibold ${p.border} ${p.text} ${p.cardBg} hover:opacity-80`}
            >
              <FileText size={20} />
              Resume
            </button>
            <button
              className={`flex items-center gap-2 rounded-xl border-2 px-8 py-4 text-lg font-semibold ${p.border} ${p.text} ${p.cardBg} hover:opacity-80`}
            >
              <Mail size={20} />
              Contact
            </button>
          </div>

          {/* Location */}
          <div className={`flex items-center justify-center gap-2 ${p.muted}`}>
            <MapPin size={18} className={p.accent} />
            <span>Plano, TX - Dallas-Fort Worth Metroplex</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className={`border-t p-4 text-center ${p.border}`}>
        <span className={`text-sm ${p.muted}`}>
          Palette {paletteKey}: {p.name}
        </span>
      </div>
    </div>
  )
}

export default function PalettePreviewPage() {
  const [selected, setSelected] = useState<PaletteKey | null>(null)

  if (selected) {
    return <FullPagePreview paletteKey={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-center text-xl font-bold text-gray-900">
          Color Palette Preview
        </h1>
        <p className="mb-12 text-center text-gray-600">
          Click any option to see a full-page preview
        </p>

        <div className="grid grid-cols-2 gap-8">
          {(Object.keys(palettes) as PaletteKey[]).map((key) => {
            const p = palettes[key]
            return (
              <div
                key={key}
                onClick={() => setSelected(key)}
                className={`cursor-pointer overflow-hidden rounded-xl border shadow-lg ${p.bg} ${p.border}`}
              >
                {/* Header */}
                <div className={`flex items-center justify-between border-b p-4 ${p.border}`}>
                  <span className={`font-bold ${p.text}`}>Option {key}: {p.name}</span>
                  <span className={`text-sm ${p.muted}`}>{p.description}</span>
                </div>

                {/* Mini preview */}
                <div className="p-8 text-center">
                  <p className={`mb-2 text-xs ${p.muted}`}>Revenue Operations Professional</p>
                  <h2 className={`mb-3 text-xl font-bold ${p.text}`}>Richard Hudson</h2>
                  <p className={`mb-4 text-sm ${p.muted}`}>
                    Driving <span className={`font-semibold ${p.primaryText}`}>$4.8M+</span> revenue impact
                  </p>

                  {/* Mini stats */}
                  <div className="mb-4 grid grid-cols-3 gap-3">
                    {['$4.8M+', '432%', '2,217%'].map((val) => (
                      <div key={val} className={`rounded-lg border p-3 ${p.cardBg} ${p.border}`}>
                        <div className={`font-bold ${p.primaryText}`}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className={`rounded-lg px-4 py-2 font-semibold text-white ${p.primary}`}>
                    View Projects
                  </button>
                </div>

                {/* Swatches */}
                <div className={`flex justify-center gap-2 border-t p-3 ${p.border}`}>
                  <div className="size-6 rounded-full" style={{ backgroundColor: p.primaryHex }} title="Primary" />
                  <div className="size-6 rounded-full" style={{ backgroundColor: p.accentHex }} title="Accent" />
                  <div className="size-6 rounded-full" style={{ backgroundColor: p.textHex }} title="Text" />
                  <div className="size-6 rounded-full" style={{ backgroundColor: p.mutedHex }} title="Muted" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
