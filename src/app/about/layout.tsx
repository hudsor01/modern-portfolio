import { Footer } from '@/components/layout/footer'

export default function MainContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full overflow-auto">{children}</main>
      <Footer />
    </div>
  )
}
