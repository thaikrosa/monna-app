import logoMonnaDark from '@/assets/logo-monna.png';

export function HomeFooter() {
  return (
    <footer className="py-8 flex flex-col items-center justify-center opacity-40">
      <img
        src={logoMonnaDark}
        alt="Monna"
        className="h-8 w-auto"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Sua parceira no invisível da maternidade
      </p>
    </footer>
  );
}
