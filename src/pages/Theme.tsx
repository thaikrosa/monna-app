import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Theme = () => {
  const colorTokens = [
    { name: "--background", label: "Background", desc: "Navy Profundo" },
    { name: "--foreground", label: "Foreground", desc: "Texto principal" },
    { name: "--primary", label: "Primary", desc: "Oliva Sofisticado" },
    { name: "--primary-foreground", label: "Primary Foreground", desc: "Texto em primary" },
    { name: "--secondary", label: "Secondary", desc: "Navy secundário" },
    { name: "--muted", label: "Muted", desc: "Aço Escovado" },
    { name: "--muted-foreground", label: "Muted Foreground", desc: "Texto muted" },
    { name: "--accent", label: "Accent", desc: "Oliva variação" },
    { name: "--card", label: "Card", desc: "Superfície card" },
    { name: "--border", label: "Border", desc: "Bordas" },
    { name: "--destructive", label: "Destructive", desc: "Ações destrutivas" },
    { name: "--ring", label: "Ring", desc: "Foco/ring" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4">Annia Design System</h1>
          <p className="text-muted-foreground text-lg">
            Tokens de tema Navy + Oliva e hierarquia tipográfica Inter.
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Tipografia</h2>
          
          <div className="space-y-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">H1 — font-bold (700/800)</span>
              <h1 className="text-5xl">Headline Principal</h1>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">H2 — font-bold (700)</span>
              <h2 className="text-4xl">Título de Seção</h2>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">H3 — font-semibold (600)</span>
              <h3 className="text-2xl">Subtítulo</h3>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">Body — font-normal (400)</span>
              <p className="text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">Small — font-medium (500)</span>
              <small className="text-sm">Texto auxiliar e labels</small>
            </div>
          </div>
        </section>

        {/* Color Tokens Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Tokens de Cor (HSL)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorTokens.map((token) => (
              <div 
                key={token.name} 
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div 
                  className="w-full h-16 rounded-md mb-3 border border-border"
                  style={{ backgroundColor: `hsl(var(${token.name}))` }}
                />
                <p className="font-semibold text-sm">{token.label}</p>
                <code className="text-xs text-muted-foreground block">{token.name}</code>
                <span className="text-xs text-muted-foreground">{token.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Button States Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Button States</h2>
          
          <div className="space-y-8">
            {/* Primary Button */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Primary Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-center">
                  <Button>Default</Button>
                  <p className="text-xs text-muted-foreground mt-2">Default</p>
                </div>
                <div className="text-center">
                  <Button className="hover:bg-primary/90">Hover</Button>
                  <p className="text-xs text-muted-foreground mt-2">Hover</p>
                </div>
                <div className="text-center">
                  <Button className="ring-2 ring-ring ring-offset-2 ring-offset-background">Focus</Button>
                  <p className="text-xs text-muted-foreground mt-2">Focus</p>
                </div>
                <div className="text-center">
                  <Button className="opacity-80 scale-95">Active</Button>
                  <p className="text-xs text-muted-foreground mt-2">Active</p>
                </div>
                <div className="text-center">
                  <Button disabled>Disabled</Button>
                  <p className="text-xs text-muted-foreground mt-2">Disabled</p>
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Secondary Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-center">
                  <Button variant="secondary">Default</Button>
                  <p className="text-xs text-muted-foreground mt-2">Default</p>
                </div>
                <div className="text-center">
                  <Button variant="secondary" className="hover:bg-secondary/80">Hover</Button>
                  <p className="text-xs text-muted-foreground mt-2">Hover</p>
                </div>
                <div className="text-center">
                  <Button variant="secondary" className="ring-2 ring-ring ring-offset-2 ring-offset-background">Focus</Button>
                  <p className="text-xs text-muted-foreground mt-2">Focus</p>
                </div>
                <div className="text-center">
                  <Button variant="secondary" disabled>Disabled</Button>
                  <p className="text-xs text-muted-foreground mt-2">Disabled</p>
                </div>
              </div>
            </div>

            {/* Outline Button */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Outline Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-center">
                  <Button variant="outline">Default</Button>
                  <p className="text-xs text-muted-foreground mt-2">Default</p>
                </div>
                <div className="text-center">
                  <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground">Hover</Button>
                  <p className="text-xs text-muted-foreground mt-2">Hover</p>
                </div>
                <div className="text-center">
                  <Button variant="outline" className="ring-2 ring-ring ring-offset-2 ring-offset-background">Focus</Button>
                  <p className="text-xs text-muted-foreground mt-2">Focus</p>
                </div>
                <div className="text-center">
                  <Button variant="outline" disabled>Disabled</Button>
                  <p className="text-xs text-muted-foreground mt-2">Disabled</p>
                </div>
              </div>
            </div>

            {/* Ghost Button */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Ghost Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-center">
                  <Button variant="ghost">Default</Button>
                  <p className="text-xs text-muted-foreground mt-2">Default</p>
                </div>
                <div className="text-center">
                  <Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">Hover</Button>
                  <p className="text-xs text-muted-foreground mt-2">Hover</p>
                </div>
                <div className="text-center">
                  <Button variant="ghost" className="ring-2 ring-ring ring-offset-2 ring-offset-background">Focus</Button>
                  <p className="text-xs text-muted-foreground mt-2">Focus</p>
                </div>
                <div className="text-center">
                  <Button variant="ghost" disabled>Disabled</Button>
                  <p className="text-xs text-muted-foreground mt-2">Disabled</p>
                </div>
              </div>
            </div>

            {/* Destructive Button */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Destructive Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-center">
                  <Button variant="destructive">Default</Button>
                  <p className="text-xs text-muted-foreground mt-2">Default</p>
                </div>
                <div className="text-center">
                  <Button variant="destructive" className="hover:bg-destructive/90">Hover</Button>
                  <p className="text-xs text-muted-foreground mt-2">Hover</p>
                </div>
                <div className="text-center">
                  <Button variant="destructive" disabled>Disabled</Button>
                  <p className="text-xs text-muted-foreground mt-2">Disabled</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Input States Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Input States</h2>
          
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Default</label>
                <Input placeholder="Placeholder text" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Focus</label>
                <Input placeholder="Focus state" className="ring-2 ring-ring ring-offset-2 ring-offset-background" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filled</label>
                <Input defaultValue="Filled value" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Disabled</label>
                <Input placeholder="Disabled" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Glassmorphism Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Glassmorphism (.annia-glass)</h2>
          
          <div className="relative p-8 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(84 25% 35%), hsl(222 47% 20%))' }}>
            <div className="annia-glass p-6 rounded-lg max-w-md">
              <h3 className="text-lg font-semibold mb-2">Glass Card</h3>
              <p className="text-sm text-muted-foreground">
                Uso pontual em cards especiais. backdrop-blur-md + fundo semi-transparente + borda 1px.
              </p>
            </div>
          </div>
        </section>

        {/* Transitions Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Transições (duration-200 linear)</h2>
          
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-muted-foreground mb-6">
              Todas as transições usam <code className="bg-muted px-2 py-1 rounded text-sm">duration-200</code> com timing linear. 
              Sem bounce, sem efeitos elásticos.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="transition-all duration-200">
                Hover me (scale)
              </Button>
              <div className="card-hover p-4 rounded-lg border border-border bg-card cursor-pointer">
                Card Hover Effect
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Theme;
