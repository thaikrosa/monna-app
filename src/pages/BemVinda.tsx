import logoMonna from '@/assets/logo-monna.png';

export default function BemVinda() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <img
          src={logoMonna}
          alt="Monna"
          className="h-10 mx-auto"
        />

        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
          Prontinho! 💛
        </h1>

        <p className="text-lg text-foreground/80 leading-relaxed">
          Vai lá no WhatsApp que a Monna já te mandou uma mensagem.
        </p>

        <p className="text-sm text-muted-foreground">
          Se a mensagem ainda não chegou, aguarde alguns segundinhos.
        </p>
      </div>
    </div>
  );
}
