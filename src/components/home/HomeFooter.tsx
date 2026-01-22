import logoMonnaDark from '@/assets/logo-monna.png';

export function HomeFooter() {
  return (
    <footer className="py-8 flex flex-col items-center justify-center">
      <img 
        src={logoMonnaDark} 
        alt="Monna" 
        className="h-10 w-auto"
      />
      <p className="mt-3 text-xs text-muted-foreground">
        Sua parceira no invisível da maternidade
      </p>
    </footer>
  );
}
