export interface APIResponse {
    success: boolean;
    service: string;
    api_version: string;
    author: string;
    data: any;
    timestamp: string;
    processing_time_ms: number;
    credits_used?: number;
    remaining_credits?: number;
    error?: string;
}
export declare function getAllServices(): Promise<{
    success: boolean;
    data: {
        services: any[];
    };
}>;
export declare function handleMediaFire(url: string): Promise<APIResponse>;
export declare function handleVehicleRC(rc: string): Promise<APIResponse>;
export declare function handleGSTLookup(gstNumber: string): Promise<APIResponse>;
export declare function handlePhoneInfo(number: string, type?: string): Promise<APIResponse>;
export declare function handleMACLookup(mac: string): Promise<APIResponse>;
export declare function handleTeraBox(url: string): Promise<APIResponse>;
export declare function handleInstagram(username: string): Promise<APIResponse>;
//# sourceMappingURL=handlers.d.ts.map