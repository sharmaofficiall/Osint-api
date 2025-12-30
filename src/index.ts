import { CreditManager, validateAdminKey } from "./credits.js";
import {
  handleMediaFire,
  handleVehicleRC,
  handleGSTLookup,
  handlePhoneInfo,
  handleMACLookup,
  handleTeraBox,
  handleInstagram,
  getAllServices,
  APIResponse,
} from "./handlers.js";

export interface User {
  apiKey: string;
  // Add other user properties as needed
}

export interface Env {
  CREDITS?: KVNamespace;
  CACHE?: KVNamespace;
  SERVER_URL: string;
  SERVER_AUTH_KEY: string;
  ADMIN_KEY: string;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.searchParams;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Get API key from header
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");

    // Public endpoints (no auth required)
    if (path === "/" || path === "/api/health") {
      return new Response(
        JSON.stringify({
          success: true,
          message: "API is running",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all services info
    if (path === "/api/services") {
      return new Response(JSON.stringify(await getAllServices()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin endpoints
    if (path.startsWith("/api/admin")) {
      const adminKey = request.headers.get("X-Admin-Key");
      if (!adminKey || !(await validateAdminKey(env.ADMIN_KEY, adminKey))) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Sync credits from server
      if (path === "/api/admin/sync-credits" && request.method === "POST") {
        try {
          if (!env.CREDITS) {
            throw new Error("CREDITS KV namespace not configured");
          }

          const response = await fetch(`${env.SERVER_URL}/api/users`, {
            headers: { Authorization: `Bearer ${env.SERVER_AUTH_KEY}` },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
          }
          const users: User[] = await response.json();

          for (const user of users) {
            await env.CREDITS.put(`user:${user.apiKey}`, JSON.stringify(user), {
              expirationTtl: 86400,
            });
          }

          return new Response(
            JSON.stringify({ success: true, message: `Synced ${users.length} users` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Sync failed",
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Get stats
      if (path === "/api/admin/stats") {
        return new Response(
          JSON.stringify({
            success: true,
            environment: env.ENVIRONMENT,
            version: "1.0.0",
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // API endpoints (no authentication required)
    const creditManager = null; // Disabled for open testing

    // MediaFire API
    if (path === "/api/mediafire") {
      const fileUrl = params.get("url");
      if (!fileUrl) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'url' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handleMediaFire(fileUrl);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Vehicle RC API
    if (path === "/api/vehicle") {
      const rc = params.get("rc");
      if (!rc) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'rc' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handleVehicleRC(rc);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GST Lookup API
    if (path === "/api/gst") {
      const gstNumber = params.get("gstNumber");
      if (!gstNumber) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'gstNumber' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handleGSTLookup(gstNumber);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Phone Number API
    if (path === "/api/phone") {
      const number = params.get("number");
      const type = params.get("type") || "pakistan";
      if (!number) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'number' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handlePhoneInfo(number, type);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // MAC Address Lookup API
    if (path === "/api/mac") {
      const mac = params.get("mac");
      if (!mac) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'mac' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handleMACLookup(mac);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TeraBox Download API
    if (path === "/api/terabox") {
      const fileUrl = params.get("url");
      if (!fileUrl) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'url' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handleTeraBox(fileUrl);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Instagram API
    if (path === "/api/instagram") {
      const username = params.get("username");
      if (!username) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'username' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handleInstagram(username);
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Truecaller API
    if (path === "/api/truecaller") {
      const number = params.get("number");
      if (!number) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'number' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await handlePhoneInfo(number, "truecaller");
      result.credits_used = 0; // No credits used in test mode
      result.remaining_credits = 999; // Unlimited for testing

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user credits
    if (path === "/api/user/credits") {
      return new Response(
        JSON.stringify({
          success: true,
          credits: 999, // Unlimited for testing
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Not found
    return new Response(
      JSON.stringify({
        success: false,
        error: "Endpoint not found",
        path,
        available_endpoints: [
          "/api/health",
          "/api/services",
          "/api/mediafire?url=URL",
          "/api/vehicle?rc=RC_NUMBER",
          "/api/gst?gstNumber=GST_NUMBER",
          "/api/phone?number=PHONE_NUMBER&type=pakistan",
          "/api/truecaller?number=PHONE_NUMBER",
          "/api/mac?mac=MAC_ADDRESS",
          "/api/terabox?url=URL",
          "/api/instagram?username=USERNAME",
          "/api/user/credits",
        ],
      }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },

  // async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
  //   // Daily sync with server (disabled for testing)
  //   console.log("Running scheduled sync...");
  //   const response = await fetch(`${env.SERVER_URL}/api/users`, {
  //     headers: { Authorization: `Bearer ${env.SERVER_AUTH_KEY}` },
  //   });

  //   if (response.ok) {
  //     const users = await response.json();
  //     for (const user of users) {
  //       await env.CREDITS.put(`user:${user.apiKey}`, JSON.stringify(user), {
  //         expirationTtl: 86400,
  //       });
  //     }
  //     console.log(`Synced ${users.length} users`);
  //   }
  // },
};
