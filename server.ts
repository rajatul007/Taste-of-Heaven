import 'dotenv/config';

async function bootstrap() {
  try {
    // @ts-ignore - dynamic loader hook registration for production Node ESM
    await import('tsx');
  } catch {
    // tsx loader might already be active
  }

  const { startServer } = await import('./server/app.ts');
  await startServer();
}

bootstrap().catch((err) => {
  console.error('Failed to start Taste of Heaven server:', err);
  process.exit(1);
});
