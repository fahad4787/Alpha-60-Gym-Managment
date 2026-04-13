export function getRequiredEnv(name: string): string {
  const value = import.meta.env[name] as string | undefined
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to your .env file (see .env.example).`,
    )
  }
  return value
}

