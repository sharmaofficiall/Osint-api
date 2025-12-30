export class CreditManager {
    constructor(creditsKV, serverUrl, serverAuthKey) {
        this.creditsKV = creditsKV;
        this.serverUrl = serverUrl;
        this.serverAuthKey = serverAuthKey;
    }
    async validateAndDeductCredits(apiKey, service, cost) {
        // For testing mode, always return valid
        return {
            valid: true,
            userId: "test-user",
            remainingCredits: 999
        };
    }
    async deductCredits(userId, apiKey, service, cost) {
        // For testing mode, do nothing
        return;
    }
    async getUserCredits(apiKey) {
        // For testing mode, return unlimited credits
        return 999;
    }
}
export async function validateAdminKey(expectedKey, providedKey) {
    return expectedKey === providedKey;
}
//# sourceMappingURL=credits.js.map