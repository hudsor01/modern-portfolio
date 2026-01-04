// Simple test page for interaction patterns
export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Interaction Patterns Test</h1>
        
        <div className="space-y-6">
          <div className="hover-lift p-6 border border-border rounded-lg bg-card">
            Hover Lift Effect
          </div>
          
          <button className="click-ripple px-6 py-3 border border-border rounded-lg bg-card w-full max-w-xs mx-auto block">
            Click Ripple Effect
          </button>
          
          <button className="interact-primary px-6 py-3 rounded-lg text-primary-foreground w-full max-w-xs mx-auto block">
            Primary Interaction
          </button>
        </div>
      </div>
    </div>
  );
}
