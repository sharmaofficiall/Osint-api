export interface User {
  id: string;
  email: string;
  apiKey: string;
  credits: number;
  totalUsed: number;
  createdAt: string;
  lastUsed: string;
}

export class CreditManager {
  constructor(
    private creditsKV: any,
    private serverUrl: string,
    private serverAuthKey: string
  ) {}

  async validateAndDeductCredits(apiKey: string, service: string, cost: number): Promise<{
    valid: boolean;
    error?: string;
    userId?: string;
    remainingCredits?: number;
  }> {
    // For testing mode, always return valid
    return {
      valid: true,
      userId: "test-user",
      remainingCredits: 999
    };
  }

  async deductCredits(userId: string, apiKey: string, service: string, cost: number): Promise<void> {
    // For testing mode, do nothing
    return;
  }

  async getUserCredits(apiKey: string): Promise<number | null> {
    // For testing mode, return unlimited credits
    return 999;
  }
}

export async function validateAdminKey(expectedKey: string, providedKey: string): Promise<boolean> {
  return expectedKey === providedKey;
}