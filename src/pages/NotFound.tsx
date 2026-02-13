const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background animate-fade-in">
      <div className="text-center animate-slide-up">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary-hover">
          Voltar para o início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
