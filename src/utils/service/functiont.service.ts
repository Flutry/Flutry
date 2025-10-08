export class FunctionService {
  public static FormatZodError = (error: any) => {
    const formattedErrors: { [key: string]: string } = {};
    // Zod 4.x verzióban az issues tömböt használjuk
    error.issues.forEach((issue: any) => {
      const fieldName = issue.path[0] as string;
      if (fieldName && !formattedErrors[fieldName]) {
        // Csak akkor írjuk felül, ha még nincs hiba erre a mezőre
        formattedErrors[fieldName] = issue.message;
      }
    });
    return formattedErrors;
  };

  public static GenerateState = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  public static sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
}
