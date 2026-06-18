export interface EndpointParameter {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface EndpointData {
  id: string;
  title: string;
  method: "GET" | "POST";
  path: string;
  contentType?: string;
  authRequired: boolean;
  description: string;
  parameters: EndpointParameter[];
  tip?: string;
  responseJson: string;
  codeSnippets: {
    curl: string;
    python: string;
    javascript: string;
  };
}

export interface ModelMatrixEntry {
  version: string;
  modelName: string;
  creditCost: number;
  description: string;
}

export interface ErrorEntry {
  status: string;
  className: string;
  description: string;
  resolution: string;
}

export const QUICK_REFERENCE = {
  baseUrl: "https://apisdk.snapmydesign.com/api/v1",
  authHeader: "X-API-Key: <smd_live_...>",
  supportEmail: "contactus@snapmydesign.com"
};

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Upload Assets",
    description: "Upload local image files (such as model profiles and garment photos) to obtain the secure cloud storage URLs needed for try-on generation.",
    endpoint: "POST /vton/upload",
    payload: "Multipart form-data containing files and userId.",
    result: "Public HTTPS URL for each uploaded asset."
  },
  {
    step: 2,
    title: "Trigger Generation",
    description: "Dispatch the generation payload containing the garment and person URLs to the rendering engine. The backend validates credits, runs the try-on generation, stores the result, and returns the final try-on image URL.",
    endpoint: "POST /vton/generate",
    payload: "JSON body with model_name, inputClothesImageUrls, inputPersonImageUrls, and parameters.",
    result: "Finished try-on image URL and generation transaction ID."
  },
  {
    step: 3,
    title: "History & Audit",
    description: "Optionally query execution history, check credit balances, and audit campaign metadata for analytical tracking and user management.",
    endpoint: "GET /history",
    payload: "Query parameters filtering by userId, limit, or tags.",
    result: "Paginated log array of all executions."
  }
];

export const MODEL_MATRIX: ModelMatrixEntry[] = [
  {
    version: "1.0 (Default)",
    modelName: "fast",
    creditCost: 0.25,
    description: "Highly optimized for rapid previewing."
  },
  {
    version: "1.0 (Default)",
    modelName: "medium",
    creditCost: 0.50,
    description: "Great balance of speed and structural details."
  },
  {
    version: "1.0 (Default)",
    modelName: "quality",
    creditCost: 1.00,
    description: "Ultra-fine resolution, premium rendering quality."
  },
  {
    version: "1.1",
    modelName: "fast",
    creditCost: 0.25,
    description: "Rapid generation run on premium cluster."
  },
  {
    version: "1.1",
    modelName: "medium",
    creditCost: 0.50,
    description: "Enhanced fidelity run on premium cluster."
  },
  {
    version: "1.1",
    modelName: "quality",
    creditCost: 1.00,
    description: "Exceptional edge preservation and detail accuracy."
  }
];

export const ERROR_CODES: ErrorEntry[] = [
  {
    status: "400",
    className: "HTTPException",
    description: "Request parameters are missing or formatted incorrectly.",
    resolution: "Verify fields and types against schemas."
  },
  {
    status: "401",
    className: "InvalidAPIKeyError",
    description: "Missing, invalid, or revoked X-API-Key header.",
    resolution: "Verify key syntax (smd_live_...) and status in dashboard."
  },
  {
    status: "403",
    className: "UnauthorizedError",
    description: "Requested userId does not match the authenticated API key owner.",
    resolution: "Ensure correct matching userId payload."
  },
  {
    status: "404",
    className: "UserNotFoundError / APIKeyNotFoundError",
    description: "Database lookup failed for the provided user ID or API key.",
    resolution: "Verify the target user exists."
  },
  {
    status: "422",
    className: "RequestValidationError",
    description: "JSON payload schema validation failed (FastAPI standard).",
    resolution: "Inspect the detail object to pinpoint validation issues."
  },
  {
    status: "501",
    className: "InsufficientCreditsError",
    description: "Credit balance is lower than the model credit cost.",
    resolution: "Direct the developer to buy credit top-up packages."
  },
  {
    status: "500",
    className: "InternalServerError",
    description: "An unhandled error occurred within the engine.",
    resolution: "Retry the request after a backoff period."
  }
];

export const STANDARD_ERROR_JSON = `{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or revoked API Key.",
  "detail": "Invalid or revoked API Key."
}`;

export const ENDPOINTS: EndpointData[] = [
  {
    id: "upload",
    title: "Upload VTON Images",
    method: "POST",
    path: "/vton/upload",
    contentType: "multipart/form-data",
    authRequired: true,
    description: "Upload image files (person profiles, garment photos) to obtain the public cloud URLs required for triggering the try-on generator.",
    parameters: [
      {
        name: "files",
        type: "List[Binary]",
        required: true,
        description: "1 to 4 image files to upload. Supports JPEG, PNG, WEBP."
      },
      {
        name: "userId",
        type: "string",
        required: true,
        description: "The user ID associated with the API key owner."
      },
      {
        name: "resolution",
        type: "integer",
        required: false,
        default: "1000",
        description: "Target resolution limit. Default is 1000 (auto-resize/optimize)."
      }
    ],
    responseJson: `{
  "success": true,
  "statusCode": 200,
  "message": "Upload successful",
  "uploaded": [
    {
      "id": "e4a2d8b5-908c-4a34-be57-410a0e954a1a",
      "url": "https://firebasestorage.googleapis.com/v0/b/xdesign-d72cd.appspot.com/o/vton_uploaded_image..."
    }
  ]
}`,
    codeSnippets: {
      curl: `curl -X POST "https://apisdk.snapmydesign.com/api/v1/vton/upload" \\
  -H "X-API-Key: smd_live_your_key_here" \\
  -F "files=@/path/to/tshirt.png" \\
  -F "userId=user_abc123"`,
      python: `import requests

API_KEY = "smd_live_your_key_here"
BASE_URL = "https://apisdk.snapmydesign.com/api/v1"
USER_ID = "user_abc123"

headers = {
    "X-API-Key": API_KEY
}

upload_url = f"{BASE_URL}/vton/upload"
files = [
    ("files", ("tshirt.png", open("tshirt.png", "rb"), "image/png"))
]
data = {
    "userId": USER_ID,
    "resolution": 1000
}

response = requests.post(upload_url, headers=headers, files=files, data=data)
response.raise_for_status()
uploaded_assets = response.json()["uploaded"]
garment_url = uploaded_assets[0]["url"]
print(f"Uploaded asset public URL: {garment_url}")`,
      javascript: `const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_KEY = 'smd_live_your_key_here';
const BASE_URL = 'https://apisdk.snapmydesign.com/api/v1';
const USER_ID = 'user_abc123';

async function uploadImage() {
  const form = new FormData();
  form.append('files', fs.createReadStream('./tshirt.png'));
  form.append('userId', USER_ID);
  form.append('resolution', '1000');

  const uploadResponse = await axios.post(\`\${BASE_URL}/vton/upload\`, form, {
    headers: {
      ...form.getHeaders(),
      'X-API-Key': API_KEY
    }
  });

  const garmentUrl = uploadResponse.data.uploaded[0].url;
  console.log(\`Uploaded asset public URL: \${garmentUrl}\`);
}`
    }
  },
  {
    id: "generate",
    title: "Generate Try-On",
    method: "POST",
    path: "/vton/generate",
    contentType: "application/json",
    authRequired: true,
    description: "Trigger the virtual try-on rendering engine. This is an asynchronous model call wrapped in a synchronous API endpoint that returns the finished URL when done.",
    parameters: [
      {
        name: "model_name",
        type: "string",
        required: true,
        description: 'Choose: "fast", "medium", or "quality".'
      },
      {
        name: "inputClothesImageUrls",
        type: "List[string]",
        required: true,
        description: "List of 1 to 4 garment image URLs (obtained from /vton/upload or public URLs)."
      },
      {
        name: "inputPersonImageUrls",
        type: "List[string]",
        required: false,
        default: "[]",
        description: "List of up to 4 reference model URLs."
      },
      {
        name: "prompt",
        type: "string",
        required: false,
        default: '""',
        description: "Optional instruction prompt. If blank, is auto-generated."
      },
      {
        name: "version",
        type: "float",
        required: false,
        default: "1.0",
        description: "Model version map: 1.0 or 1.1."
      },
      {
        name: "productId",
        type: "string",
        required: false,
        default: "null",
        description: "Optional internal catalog SKU/ID (helps track product usage metrics)."
      },
      {
        name: "externalUserId",
        type: "string",
        required: false,
        default: "null",
        description: "Optional end-consumer identifier of your client application."
      },
      {
        name: "metadata",
        type: "object",
        required: false,
        default: "null",
        description: "Optional key-value dictionary for storing custom properties."
      }
    ],
    tip: "Prompt Auto-Generation: If you leave prompt empty, the backend engine dynamically builds a highly descriptive VTON prompt based on the layout and number of input images (e.g. \"Replace the clothing in the first image with the garment from the 2nd image.\").",
    responseJson: `{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "generationId": "50c76d05-4f40-424a-9ef8-11db9390234a",
  "outputImageUrls": [
    "https://firebasestorage.googleapis.com/.../vton_generated_image..."
  ],
  "inputClothesImageUrls": [
    "https://firebasestorage.googleapis.com/.../vton_uploaded_image..."
  ],
  "inputPersonImageUrls": [],
  "userId": "user_abc123",
  "creditCost": 0.5,
  "modelName": "medium",
  "version": 1.0,
  "prompt": "Replace the clothing in the first image with the garment from the 1th image.",
  "productId": "sku_9921_blue",
  "externalUserId": "consumer_myntra_77612",
  "metadata": {
    "campaign": "summer_sale_2026",
    "gender": "male"
  },
  "startTimestamp": 1780000000,
  "endTimestamp": 1780000005,
  "apiKeyLabel": "production_server_key"
}`,
    codeSnippets: {
      curl: `curl -X POST "https://apisdk.snapmydesign.com/api/v1/vton/generate" \\
  -H "X-API-Key: smd_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_name": "medium",
    "inputClothesImageUrls": [
      "https://firebasestorage.googleapis.com/v0/b/xdesign-d72cd.appspot.com/o/vton_uploaded_image%2Ftshirt.png"
    ],
    "inputPersonImageUrls": [],
    "prompt": "Put the shirt on the model",
    "version": 1.0,
    "userId": "user_abc123"
  }'`,
      python: `import requests

API_KEY = "smd_live_your_key_here"
BASE_URL = "https://apisdk.snapmydesign.com/api/v1"
USER_ID = "user_abc123"

headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

generate_url = f"{BASE_URL}/vton/generate"
payload = {
    "model_name": "medium",
    "inputClothesImageUrls": ["https://firebasestorage.googleapis.com/v0/b/xdesign-d72cd.appspot.com/o/vton_uploaded_image%2Ftshirt.png"],
    "inputPersonImageUrls": [],
    "prompt": "Put the uploaded garment on the model",
    "version": 1.0,
    "userId": USER_ID,
    "productId": "SKU-TSHIRT-BLUE-M",
    "metadata": {
        "client": "mobile_app",
        "env": "production"
    }
}

gen_response = requests.post(generate_url, headers=headers, json=payload)
gen_response.raise_for_status()
result = gen_response.json()

if result.get("success"):
    print(f"Successfully generated try-on!")
    print(f"Output Image URL: {result['outputImageUrls'][0]}")`,
      javascript: `const axios = require('axios');

const API_KEY = 'smd_live_your_key_here';
const BASE_URL = 'https://apisdk.snapmydesign.com/api/v1';
const USER_ID = 'user_abc123';

async function generateVton(garmentUrl) {
  const payload = {
    model_name: 'medium',
    inputClothesImageUrls: [garmentUrl],
    inputPersonImageUrls: [],
    prompt: 'Put the shirt on the model',
    version: 1.0,
    userId: USER_ID
  };

  const genResponse = await axios.post(\`\${BASE_URL}/vton/generate\`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    }
  });

  if (genResponse.data.success) {
    console.log('Successfully generated try-on!');
    console.log(\`Output Image URL: \${genResponse.data.outputImageUrls[0]}\`);
  }
}`
    }
  },
  {
    id: "credits",
    title: "Check Credits",
    method: "POST",
    path: "/user/credits",
    contentType: "application/json",
    authRequired: false,
    description: "Query the current credit balance of your developer account.",
    parameters: [
      {
        name: "userId",
        type: "string",
        required: true,
        description: "The user ID to query."
      }
    ],
    responseJson: `{
  "success": true,
  "statusCode": 200,
  "message": "User credits found",
  "credits": {
    "user": {
      "userId": "user_abc123"
    },
    "credits": 42.5
  }
}`,
    codeSnippets: {
      curl: `curl -X POST "https://apisdk.snapmydesign.com/api/v1/user/credits" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user_abc123"
  }'`,
      python: `import requests

BASE_URL = "https://apisdk.snapmydesign.com/api/v1"
USER_ID = "user_abc123"

response = requests.post(
    f"{BASE_URL}/user/credits",
    json={"userId": USER_ID}
)
response.raise_for_status()
print("Credits:", response.json()["credits"]["credits"])`,
      javascript: `const axios = require('axios');

const BASE_URL = 'https://apisdk.snapmydesign.com/api/v1';
const USER_ID = 'user_abc123';

async function checkCredits() {
  const response = await axios.post(\`\${BASE_URL}/user/credits\`, {
    userId: USER_ID
  });
  console.log('Credits:', response.data.credits.credits);
}`
    }
  },
  {
    id: "history",
    title: "Get Generation History",
    method: "GET",
    path: "/history",
    authRequired: false,
    description: "Retrieve a paginated list of previous try-on generations for auditing and usage analytics.",
    parameters: [
      {
        name: "userId",
        type: "string",
        required: true,
        description: "User ID of the developer account."
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        default: "20",
        description: "Limit results (range 1 to 100)."
      },
      {
        name: "startTimestamp",
        type: "integer",
        required: false,
        description: "Filter generations started on/after this UNIX timestamp."
      },
      {
        name: "endTimestamp",
        type: "integer",
        required: false,
        description: "Filter generations ended on/before this UNIX timestamp."
      },
      {
        name: "apiKeyLabel",
        type: "string",
        required: false,
        description: "Filter by the specific API key label used."
      },
      {
        name: "productId",
        type: "string",
        required: false,
        description: "Filter by catalog product SKU."
      },
      {
        name: "externalUserId",
        type: "string",
        required: false,
        description: "Filter by client consumer ID."
      }
    ],
    responseJson: `{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "data": [
    {
      "generationId": "50c76d05-4f40-424a-9ef8-11db9390234a",
      "userId": "user_abc123",
      "creditCost": 0.5,
      "numberOfImages": 1,
      "outputImageUrls": [
        "https://firebasestorage.googleapis.com/.../vton_generated_image..."
      ],
      "inputClothesImageUrls": [
        "https://firebasestorage.googleapis.com/.../vton_uploaded_image..."
      ],
      "inputPersonImageUrls": [],
      "prompt": "Replace the clothing in the first image with the garment from the 1th image.",
      "version": 1.0,
      "modelName": "medium",
      "apiKeyLabel": "production_server_key",
      "startTimestamp": 1780000000,
      "endTimestamp": 1780000005,
      "productId": "sku_9921_blue",
      "externalUserId": "consumer_myntra_77612",
      "metadata": {
        "campaign": "summer_sale_2026"
      }
    }
  ],
  "nextCursor": "gen_87a9bf...",
  "limit": 20,
  "totalCount": 1
}`,
    codeSnippets: {
      curl: `curl "https://apisdk.snapmydesign.com/api/v1/history?userId=user_abc123&limit=5"`,
      python: `import requests

BASE_URL = "https://apisdk.snapmydesign.com/api/v1"
USER_ID = "user_abc123"

response = requests.get(
    f"{BASE_URL}/history",
    params={"userId": USER_ID, "limit": 5}
)
response.raise_for_status()
history = response.json()["data"]
for record in history:
    print(f"Gen ID: {record['generationId']} | Model: {record['modelName']}")`,
      javascript: `const axios = require('axios');

const BASE_URL = 'https://apisdk.snapmydesign.com/api/v1';
const USER_ID = 'user_abc123';

async function getHistory() {
  const response = await axios.get(\`\${BASE_URL}/history\`, {
    params: { userId: USER_ID, limit: 5 }
  });
  console.log('History data length:', response.data.data.length);
}`
    }
  },
  {
    id: "health-check",
    title: "Service Health Check",
    method: "GET",
    path: "/vton",
    authRequired: false,
    description: "Fast endpoint to perform load-balancer verification or check if our service router is running correctly.",
    parameters: [],
    responseJson: `{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "mode": "vton service from SMD SDK",
  "data": []
}`,
    codeSnippets: {
      curl: `curl "https://apisdk.snapmydesign.com/api/v1/vton"`,
      python: `import requests

BASE_URL = "https://apisdk.snapmydesign.com/api/v1"
response = requests.get(f"{BASE_URL}/vton")
print("Status:", response.json()["message"])`,
      javascript: `const axios = require('axios');

const BASE_URL = 'https://apisdk.snapmydesign.com/api/v1';

async function checkHealth() {
  const response = await axios.get(\`\${BASE_URL}/vton\`);
  console.log('Status:', response.data.message);
}`
    }
  }
];

export const INTEGRATION_CODE_EXAMPLES = {
  curl: `# Step 1: Upload a file to receive a public URL
curl -X POST "https://apisdk.snapmydesign.com/api/v1/vton/upload" \\
  -H "X-API-Key: smd_live_your_key_here" \\
  -F "files=@/path/to/tshirt.png" \\
  -F "userId=user_abc123"

# Step 2: Trigger Generation using the uploaded URL
curl -X POST "https://apisdk.snapmydesign.com/api/v1/vton/generate" \\
  -H "X-API-Key: smd_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_name": "medium",
    "inputClothesImageUrls": [
      "https://firebasestorage.googleapis.com/v0/b/xdesign-d72cd.appspot.com/o/vton_uploaded_image%2Ftshirt.png"
    ],
    "inputPersonImageUrls": [],
    "prompt": "Put the shirt on the model",
    "version": 1.0,
    "userId": "user_abc123"
  }'`,

  python: `import requests

API_KEY = "smd_live_your_key_here"
BASE_URL = "https://apisdk.snapmydesign.com/api/v1"
USER_ID = "user_abc123"

headers = {
    "X-API-Key": API_KEY
}

# 1. Upload the image file
upload_url = f"{BASE_URL}/vton/upload"
files = [
    ("files", ("tshirt.png", open("tshirt.png", "rb"), "image/png"))
]
data = {
    "userId": USER_ID,
    "resolution": 1000
}

response = requests.post(upload_url, headers=headers, files=files, data=data)
response.raise_for_status()
uploaded_assets = response.json()["uploaded"]
garment_url = uploaded_assets[0]["url"]
print(f"Uploaded asset public URL: {garment_url}")

# 2. Trigger try-on generation
generate_url = f"{BASE_URL}/vton/generate"
payload = {
    "model_name": "medium",
    "inputClothesImageUrls": [garment_url],
    "inputPersonImageUrls": [],  # Optional reference model images
    "prompt": "Put the uploaded garment on the model",
    "version": 1.0,
    "userId": USER_ID,
    "productId": "SKU-TSHIRT-BLUE-M",
    "metadata": {
        "client": "mobile_app",
        "env": "production"
    }
}

gen_response = requests.post(generate_url, headers=headers, json=payload)
gen_response.raise_for_status()
result = gen_response.json()

if result.get("success"):
    print(f"Successfully generated try-on!")
    print(f"Output Image URL: {result['outputImageUrls'][0]}")
    print(f"Generation ID: {result['generationId']}")
    print(f"Transaction Cost: {result['creditCost']} credits")
else:
    print(f"Generation failed: {result.get('message')}")`,

  javascript: `const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_KEY = 'smd_live_your_key_here';
const BASE_URL = 'https://apisdk.snapmydesign.com/api/v1';
const USER_ID = 'user_abc123';

async function generateTryon() {
  try {
    // 1. Prepare and send Multipart file upload
    const form = new FormData();
    form.append('files', fs.createReadStream('./tshirt.png'));
    form.append('userId', USER_ID);
    form.append('resolution', '1000');

    const uploadResponse = await axios.post(\`\${BASE_URL}/vton/upload\`, form, {
      headers: {
        ...form.getHeaders(),
        'X-API-Key': API_KEY
      }
    });

    const garmentUrl = uploadResponse.data.uploaded[0].url;
    console.log(\`Uploaded asset public URL: \${garmentUrl}\`);

    // 2. Trigger generation
    const payload = {
      model_name: 'medium',
      inputClothesImageUrls: [garmentUrl],
      inputPersonImageUrls: [],
      prompt: 'Put the shirt on the model',
      version: 1.0,
      userId: USER_ID
    };

    const genResponse = await axios.post(\`\${BASE_URL}/vton/generate\`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      }
    });

    if (genResponse.data.success) {
      console.log('Successfully generated try-on!');
      console.log(\`Output Image URL: \${genResponse.data.outputImageUrls[0]}\`);
      console.log(\`Generation ID: \${genResponse.data.generationId}\`);
      console.log(\`Transaction Cost: \${genResponse.data.creditCost} credits\`);
    } else {
      console.log(\`Generation failed: \${genResponse.data.message}\`);
    }
  } catch (error) {
    if (error.response) {
      console.error(\`API Error (\${error.response.status}):\`, error.response.data);
    } else {
      console.error('Request Error:', error.message);
    }
  }
}

generateTryon();`
};
