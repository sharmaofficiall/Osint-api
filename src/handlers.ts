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

export async function getAllServices(): Promise<{ success: boolean; data: { services: any[] } }> {
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

export async function handleMediaFire(url: string): Promise<APIResponse> {
  const startTime = Date.now();

  try {
    // Extract file ID from MediaFire URL
    const fileIdMatch = url.match(/\/file\/([^\/]+)/);
    if (!fileIdMatch) {
      return {
        success: false,
        service: "mediafire",
        api_version: "1.0.0",
        author: "your_name",
        data: null,
        error: "Invalid MediaFire URL format",
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime
      };
    }

    const fileId = fileIdMatch[1];

    // Use the provided backend API to get real MediaFire data
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api?url=${encodeURIComponent(url)}`);

    if (apiResponse.ok) {
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false) {
        const result: APIResponse = {
          success: true,
          service: "mediafire",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: {
            file_id: fileId,
            file_name: data.filename || data.file_name || 'Unknown',
            file_url: url,
            download_url: data.direct_download || data.download_url || url,
            file_size: data.size || data.file_size || 'Unknown',
            file_type: data.file_type || 'Unknown',
            upload_date: data.upload_date || 'Unknown',
            status: 'Available',
            source: 'Backend API'
          },
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error
        const result: APIResponse = {
          success: false,
          service: "mediafire",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "File not found or unavailable",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    }

    // Return error if API doesn't return valid data
    const errorResponse: APIResponse = {
      success: false,
      service: "mediafire",
      api_version: "1.0.0",
      author: "your_name",
      data: null,
      error: "MediaFire file information unavailable",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return errorResponse;
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: "mediafire",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch MediaFire file information",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}

export async function handleVehicleRC(rc: string): Promise<APIResponse> {
  const startTime = Date.now();

  try {
    // Use the backend API for vehicle RC lookup
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/vehicle?rc=${encodeURIComponent(rc)}`);

    if (apiResponse.ok) {
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false) {
        const result: APIResponse = {
          success: true,
          service: "vehicle_rc",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error
        const result: APIResponse = {
          success: false,
          service: "vehicle_rc",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "Vehicle information not found",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    }

    // Return error if API doesn't respond
    const response: APIResponse = {
      success: false,
      service: "vehicle_rc",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Vehicle RC lookup service unavailable",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: "vehicle_rc",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch vehicle information",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}

export async function handleGSTLookup(gstNumber: string): Promise<APIResponse> {
  const startTime = Date.now();

  try {
    // Use the backend API for GST lookup
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/gst?gstNumber=${encodeURIComponent(gstNumber)}`);

    if (apiResponse.ok) {
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false) {
        const result: APIResponse = {
          success: true,
          service: "gst_lookup",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error
        const result: APIResponse = {
          success: false,
          service: "gst_lookup",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "GST information not found",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    }

    // Return error if API doesn't respond
    const response: APIResponse = {
      success: false,
      service: "gst_lookup",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "GST lookup service unavailable",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: "gst_lookup",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch GST information",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}

export async function handlePhoneInfo(number: string, type: string = "pakistan"): Promise<APIResponse> {
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
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false) {
        const result: APIResponse = {
          success: true,
          service: serviceName,
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error
        const result: APIResponse = {
          success: false,
          service: serviceName,
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "Phone number lookup not found",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    }

    // Return error if API doesn't respond
    const response: APIResponse = {
      success: false,
      service: type === "truecaller" ? "phone_truecaller" : "phone_pakistan",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Phone number lookup service unavailable",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: type === "truecaller" ? "phone_truecaller" : "phone_pakistan",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch phone information",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}

export async function handleMACLookup(mac: string): Promise<APIResponse> {
  const startTime = Date.now();

  try {
    // Use the backend API for MAC lookup
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/mac?mac=${encodeURIComponent(mac)}`);

    if (apiResponse.ok) {
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false) {
        const result: APIResponse = {
          success: true,
          service: "mac_address",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error
        const result: APIResponse = {
          success: false,
          service: "mac_address",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "MAC address information not found",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    }

    // Return error if API doesn't respond
    const response: APIResponse = {
      success: false,
      service: "mac_address",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "MAC address lookup service unavailable",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: "mac_address",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch MAC address information",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}

export async function handleTeraBox(url: string): Promise<APIResponse> {
  const startTime = Date.now();

  try {
    // Use the backend API for TeraBox lookup
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/terabox?url=${encodeURIComponent(url)}`);

    if (apiResponse.ok) {
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false) {
        const result: APIResponse = {
          success: true,
          service: "terabox",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error
        const result: APIResponse = {
          success: false,
          service: "terabox",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data.message || "TeraBox file information not found",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    }

    // Return error if API doesn't respond
    const response: APIResponse = {
      success: false,
      service: "terabox",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "TeraBox lookup service unavailable",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: "terabox",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: "Unable to fetch TeraBox file information",
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}

export async function handleInstagram(username: string): Promise<APIResponse> {
  const startTime = Date.now();

  try {
    // Validate username format
    if (!username || username.trim().length === 0) {
      return {
        success: false,
        service: "instagram",
        api_version: "1.0.0",
        author: "Sharmaofficial",
        data: null,
        error: "Invalid Instagram username",
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime
      };
    }

    // Use the backend API for Instagram lookup
    const apiResponse = await fetch(`https://mediafire.m2hgamerz.workers.dev/api/instagram?username=${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json() as any;

      // Check if we got valid data from the backend API
      if (data && data.success !== false && data.data) {
        const result: APIResponse = {
          success: true,
          service: "instagram",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: data.data || data,
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      } else {
        // Backend API returned an error or no data
        const result: APIResponse = {
          success: false,
          service: "instagram",
          api_version: "1.0.0",
          author: "Sharmaofficial",
          data: null,
          error: data?.message || "Instagram profile not found or private",
          timestamp: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        };

        return result;
      }
    } else {
      // API request failed
      const result: APIResponse = {
        success: false,
        service: "instagram",
        api_version: "1.0.0",
        author: "Sharmaofficial",
        data: null,
        error: `API returned status ${apiResponse.status}`,
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime
      };

      return result;
    }
  } catch (error) {
    const response: APIResponse = {
      success: false,
      service: "instagram",
      api_version: "1.0.0",
      author: "Sharmaofficial",
      data: null,
      error: `Error: ${error instanceof Error ? error.message : "Unable to fetch Instagram profile"}`,
      timestamp: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    return response;
  }
}