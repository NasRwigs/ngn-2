/** Minimum password length for sign-up and password reset (client + server copy). */
export const MIN_PASSWORD_LENGTH = 8;

export function passwordMeetsMinLength(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export const MIN_PASSWORD_LENGTH_HINT = `At least ${MIN_PASSWORD_LENGTH} characters.`;
