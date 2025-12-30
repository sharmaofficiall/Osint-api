var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/credits.js
async function validateAdminKey(expectedKey, providedKey) {
  return expectedKey === providedKey;
}
__name(validateAdminKey, "validateAdminKey");

// src/handlers.js
async function getAllServices() {
  return {
    success: true,
    data: {
      services: [
        {
          name: "mediafire",
          endpoint: "/api/mediafire?url=URL",
          description: "Extract direct download links from MediaFire",
          cost: 1,
          parameters: { url: "MediaFire URL (required)" }
        },
        {
          name: "vehicle_rc",
          endpoint: "/api/vehicle?rc=RC_NUMBER",
          description: "Get vehicle information by RC number",
          cost: 2,
          parameters: { rc: "Vehicle RC number (required)" }
        },
        {
          name: "gst_lookup",
          endpoint: "/api/gst?gstNumber=GST_NUMBER",
          description: "Lookup GST registration information",
          cost: 1,
          parameters: { gstNumber: "15-digit GST number (required)" }
        },
        {
          name: "pakistan_number",
          endpoint: "/api/phone?number=PHONE&type=pakistan",
          description: "Get information about Pakistan phone numbers",
          cost: 1,
          parameters: { number: "Pakistan phone number (required)" }
        },
        {
          name: "terabox",
          endpoint: "/api/terabox?url=TERABOX_URL",
          description: "Get TeraBox video download links",
          cost: 1,
          parameters: { url: "TeraBox URL (required)" }
        },
        {
          name: "instagram",
          endpoint: "/api/instagram?username=USERNAME",
          description: "Get Instagram follower count and profile info",
          cost: 1,
          parameters: { username: "Instagram username (required)" }
        },
        {
          name: "truecaller",
          endpoint: "/api/truecaller?number=PHONE_NUMBER",
          description: "Lookup phone number information via Truecaller",
          cost: 2,
          parameters: { number: "Phone number (required)" }
        },
        {
          name: "mac_address",
          endpoint: "/api/mac?mac=MAC_ADDRESS",
          description: "Lookup MAC address vendor information",
          cost: 1,
          parameters: { mac: "MAC address (required)" }
        }
      ]
    }
  };
}
__name(getAllServices, "getAllServices");
async function handleMediaFire(url) {
  const startTime = Date.now();
  try {
    const fileIdMatch = url.match(/\/file\/([^\/]+)/);
    if (!fileIdMatch) {
      return {
        success: false,
        service: "mediafire",
        api_version: "1.0.0",
        author: "your_name",
        data: null,
        error: "Invalid MediaFire URL format",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        processing_time_ms: Date.now() - startTime
      };
    }
    const fileId = fileIdMatch[1];
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api?url=${encodeURIComponent(url)}`);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false) {
        const result = {
          success: true,
          service: "mediafire",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: {
            file_id: fileId,
            file_name: data.filename || data.file_name || "Unknown",
            file_url: url,
            download_url: data.direct_download || data.download_url || url,
            file_size: data.size || data.file_size || "Unknown",
            file_type: data.file_type || "Unknown",
            upload_date: data.upload_date || "Unknown",
            status: "Available",
            source: "Backend API"
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: "mediafire",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "File not found or unavailable",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    }
    const errorResponse = {
      success: false,
      service: "mediafire",
      api_version: "1.0.0",
      author: "your_name",
      data: null,
      error: "MediaFire file information unavailable",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return errorResponse;
  } catch (error) {
    const response = {
      success: false,
      service: "mediafire",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch MediaFire file information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handleMediaFire, "handleMediaFire");
async function handleVehicleRC(rc) {
  const startTime = Date.now();
  try {
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/vehicle?rc=${encodeURIComponent(rc)}`);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false) {
        const result = {
          success: true,
          service: "vehicle_rc",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: "vehicle_rc",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "Vehicle information not found",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    }
    const response = {
      success: false,
      service: "vehicle_rc",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Vehicle RC lookup service unavailable",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      service: "vehicle_rc",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch vehicle information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handleVehicleRC, "handleVehicleRC");
async function handleGSTLookup(gstNumber) {
  const startTime = Date.now();
  try {
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/gst?gstNumber=${encodeURIComponent(gstNumber)}`);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false) {
        const result = {
          success: true,
          service: "gst_lookup",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: "gst_lookup",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "GST information not found",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    }
    const response = {
      success: false,
      service: "gst_lookup",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "GST lookup service unavailable",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      service: "gst_lookup",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch GST information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handleGSTLookup, "handleGSTLookup");
async function handlePhoneInfo(number, type = "pakistan") {
  const startTime = Date.now();
  try {
    let apiUrl = "";
    let serviceName = "phone_pakistan";
    if (type === "truecaller") {
      apiUrl = `https://mediafire.m2hgamerz.workers.dev/api/truecaller?number=${encodeURIComponent(number)}`;
      serviceName = "phone_truecaller";
    } else {
      apiUrl = `https://mediafire.m2hgamerz.workers.dev/api/phone?number=${encodeURIComponent(number)}`;
      serviceName = "phone_pakistan";
    }
    const apiResponse = await fetch(apiUrl);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false) {
        const result = {
          success: true,
          service: serviceName,
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: serviceName,
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "Phone number lookup not found",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    }
    const response = {
      success: false,
      service: type === "truecaller" ? "phone_truecaller" : "phone_pakistan",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Phone number lookup service unavailable",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      service: type === "truecaller" ? "phone_truecaller" : "phone_pakistan",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch phone information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handlePhoneInfo, "handlePhoneInfo");
async function handleMACLookup(mac) {
  const startTime = Date.now();
  try {
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/mac?mac=${encodeURIComponent(mac)}`);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false) {
        const result = {
          success: true,
          service: "mac_address",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: "mac_address",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "MAC address information not found",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    }
    const response = {
      success: false,
      service: "mac_address",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "MAC address lookup service unavailable",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      service: "mac_address",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch MAC address information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handleMACLookup, "handleMACLookup");
async function handleTeraBox(url) {
  const startTime = Date.now();
  try {
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/terabox?url=${encodeURIComponent(url)}`);
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false) {
        const result = {
          success: true,
          service: "terabox",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: "terabox",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "TeraBox file information not found",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    }
    const response = {
      success: false,
      service: "terabox",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "TeraBox lookup service unavailable",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  } catch (error) {
    const response = {
      success: false,
      service: "terabox",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch TeraBox file information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handleTeraBox, "handleTeraBox");
async function handleInstagram(username) {
  const startTime = Date.now();
  try {
    if (!username || username.trim().length === 0) {
      return {
        success: false,
        service: "instagram",
        api_version: "1.0.0",
        author: "Sharmaofficial",
        data: null,
        error: "Invalid Instagram username",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        processing_time_ms: Date.now() - startTime
      };
    }
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/instagram?username=${encodeURIComponent(username)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.success !== false && data.data) {
        const result = {
          success: true,
          service: "instagram",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      } else {
        const result = {
          success: false,
          service: "instagram",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data?.message || "Instagram profile not found or private",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          processing_time_ms: Date.now() - startTime
        };
        return result;
      }
    } else {
      const result = {
        success: false,
        service: "instagram",
        api_version: "1.0.0",
        author: "Sharmaofficial",
        data: null,
        error: `API returned status ${apiResponse.status}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        processing_time_ms: Date.now() - startTime
      };
      return result;
    }
  } catch (error) {
    const response = {
      success: false,
      service: "instagram",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: `Error: ${error instanceof Error ? error.message : "Unable to fetch Instagram profile"}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      processing_time_ms: Date.now() - startTime
    };
    return response;
  }
}
__name(handleInstagram, "handleInstagram");

// src/index.ts
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.searchParams;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (path === "/" || path === "/api/health") {
      return new Response(
        JSON.stringify({
          success: true,
          message: "API is running",
          version: "1.0.0",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (path === "/api/services") {
      return new Response(JSON.stringify(await getAllServices()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path.startsWith("/api/admin")) {
      const adminKey = request.headers.get("X-Admin-Key");
      if (!adminKey || !await validateAdminKey(env.ADMIN_KEY, adminKey)) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (path === "/api/admin/sync-credits" && request.method === "POST") {
        try {
          if (!env.CREDITS) {
            throw new Error("CREDITS KV namespace not configured");
          }
          const response = await fetch(`${env.SERVER_URL}/api/users`, {
            headers: { Authorization: `Bearer ${env.SERVER_AUTH_KEY}` }
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
          }
          const users = await response.json();
          for (const user of users) {
            await env.CREDITS.put(`user:${user.apiKey}`, JSON.stringify(user), {
              expirationTtl: 86400
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
              error: error instanceof Error ? error.message : "Sync failed"
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      if (path === "/api/admin/stats") {
        return new Response(
          JSON.stringify({
            success: true,
            environment: env.ENVIRONMENT,
            version: "1.0.0",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    const creditManager = null;
    if (path === "/api/mediafire") {
      const fileUrl = params.get("url");
      if (!fileUrl) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'url' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handleMediaFire(fileUrl);
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/vehicle") {
      const rc = params.get("rc");
      if (!rc) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'rc' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handleVehicleRC(rc);
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/gst") {
      const gstNumber = params.get("gstNumber");
      if (!gstNumber) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'gstNumber' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handleGSTLookup(gstNumber);
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
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
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/mac") {
      const mac = params.get("mac");
      if (!mac) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'mac' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handleMACLookup(mac);
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/terabox") {
      const fileUrl = params.get("url");
      if (!fileUrl) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'url' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handleTeraBox(fileUrl);
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/instagram") {
      const username = params.get("username");
      if (!username) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'username' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handleInstagram(username);
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/truecaller") {
      const number = params.get("number");
      if (!number) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing 'number' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const result = await handlePhoneInfo(number, "truecaller");
      result.credits_used = 0;
      result.remaining_credits = 999;
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (path === "/api/user/credits") {
      return new Response(
        JSON.stringify({
          success: true,
          credits: 999,
          // Unlimited for testing
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
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
          "/api/user/credits"
        ]
      }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
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
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
