import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://docs.snapmydesign.com";
  
  // Define all the canonical paths for the docs site with trailing slashes
  const paths = [
    "/",
    "/docs/api/",
    "/docs/api/authentication/",
    "/docs/api/workflow/",
    "/docs/api/endpoints/upload/",
    "/docs/api/endpoints/generate/",
    "/docs/api/endpoints/credits/",
    "/docs/api/endpoints/history/",
    "/docs/api/endpoints/health-check/",
    "/docs/api/credit-matrix/",
    "/docs/api/errors/",
    "/docs/api/examples/",
    
    "/docs/npm/",
    "/docs/npm/installation/",
    "/docs/npm/client-reference/",
    "/docs/npm/errors/",
    "/docs/npm/examples/",
    
    "/docs/flutter/",
    "/docs/flutter/installation/",
    "/docs/flutter/configuration/",
    "/docs/flutter/widgets/try-on-viewer/",
    "/docs/flutter/examples/",
    
    "/docs/ios/",
    "/docs/ios/installation/",
    "/docs/ios/controller/",
    "/docs/ios/examples/",
    
    "/docs/android/",
    "/docs/android/installation/",
    "/docs/android/activity/",
    "/docs/android/examples/",
  ];

  const currentDate = new Date();

  return paths.map((path) => {
    // Determine priority and frequency based on path structure
    let changeFrequency: "daily" | "weekly" | "monthly" = "monthly";
    let priority = 0.6;

    if (path === "/" || path === "/docs/api/") {
      changeFrequency = "weekly";
      priority = 1.0;
    } else if (path.includes("/endpoints/") || path.includes("/widgets/")) {
      changeFrequency = "weekly";
      priority = 0.8;
    }

    return {
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });
}
