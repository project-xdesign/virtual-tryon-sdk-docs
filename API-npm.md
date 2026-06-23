# Snapmydesign Virtual Try-On (VTON) SDK

Official JavaScript/TypeScript SDK for the **Snapmydesign (SMD) Virtual Try-On API**.

* **Official Website:** [sdk.snapmydesign.com](https://sdk.snapmydesign.com)
* **Developer Console:** [console.snapmydesign.com](https://console.snapmydesign.com)
* **Developer Documentation:** [docs.snapmydesign.com](https://docs.snapmydesign.com)

This SDK supports both browser environments and Node.js (v18+) with zero production dependencies, native fetch compatibility, and full TypeScript typing out of the box.

---

## 🚀 Installation

```bash
npm install snapit_sdk
```

---

## 🏃 Running the Example Integration Demo

The SDK repository includes a runnable integration script demonstrating the end-to-end workflow (checking service health, retrieving credit balance, uploading reference garments/model, and running a generation):

1. **Configure Environment Variables**:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   SMD_API_KEY=smd_live_...
   SMD_USER_ID=your_developer_user_id
   ```

2. **Execute the Demo**:
   ```bash
   npm run example
   ```

---

## 🔐 Getting Started & Authentication

To use the client, you need an API key (`smd_live_...`) and your Developer User ID. You can obtain both by registering and logging in to the Developer Console at **[console.snapmydesign.com](https://console.snapmydesign.com)**.

### 1. Initialize the Client

You can explicitly pass the API key or set the `SMD_API_KEY` (or `VTON_API_KEY`) environment variable. You can also specify the `SMD_USER_ID` environment variable for tracking and querying credits.

```typescript
import { VTONClient } from 'snapit_sdk';

// Explicit configuration
const client = new VTONClient({
  apiKey: 'smd_live_your_api_key_here',
  // baseUrl: 'https://apisdk.snapmydesign.com/api/v1' // Optional (defaults to production)
});

// Or initialize using environment variables:
// process.env.SMD_API_KEY = "smd_live_your_api_key_here"
// const client = new VTONClient();
```

---

## 🪄 Virtual Try-On Workflow

The typical lifecycle consists of:
1. Uploading model or garment images.
2. Generating the try-on image using those uploaded URLs.

### Full Example:

```typescript
import { VTONClient, InsufficientCreditsError } from 'snapit_sdk';

const client = new VTONClient({ apiKey: 'smd_live_...' });

async function runTryOn() {
  try {
    const userId = 'user_abc123';

    // 1. Upload person and clothes images
    // Supports: File Paths (Node.js), Blobs, Files, Node.js Buffers, or custom { data, name } objects
    console.log('Uploading assets...');
    const uploadRes = await client.uploadImages(userId, [
      './person.jpg', // Local file path (Node.js only)
      './tshirt.png'
    ], 1000); // 1000 is the optional resolution parameter

    const urls = uploadRes.uploaded.map(item => item.url);
    console.log('Uploaded asset URLs:', urls);

    // 2. Trigger try-on generation
    console.log('Generating Try-On image...');
    const generation = await client.generateTryOn({
      model_name: 'quality', // Options: "fast" (0.25 credits), "medium" (0.50 credits), "quality" (1.00 credit)
      inputClothesImageUrls: [urls[1]],
      inputPersonImageUrls: [urls[0]],
      prompt: 'Put the tshirt on the person', // Optional
      version: 1.1,
      productId: 'sku_9921_blue', // Optional product SKU
      externalUserId: 'consumer_77612', // Optional external identifier
      metadata: {
        campaign: 'summer_sale_2026'
      }
    });

    if (generation.success) {
      console.log('Generated Try-On image URL:', generation.outputImageUrls[0]);
      console.log('Credits charged:', generation.creditCost);
      console.log('Generation ID:', generation.generationId);
    }
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      console.error('Failed: You have insufficient credits for this model.');
    } else {
      console.error('VTON SDK Error:', error.message);
    }
  }
}

runTryOn();
```

---

## 🛠️ API Reference

### VTON Services

#### `client.healthCheck()`
Verifies the status and availability of the SMD VTON services.
* **Returns:** `Promise<HealthCheckResponse>`

#### `client.uploadImages(userId, files, resolution)`
Uploads images to obtain public cloud URLs.
* **`userId`** `string`: Must match the ID associated with the API key.
* **`files`** `UploadFile[]`: Array containing:
  - Filepath `string` (Node.js only)
  - `Blob` or `File` (Browser/Node)
  - `Buffer` (Node.js)
  - Custom file objects: `{ data: Buffer | Blob | ArrayBuffer, name: string, type?: string }`
* **`resolution`** `number` (Optional): Target resolution limit. Defaults to `1000`.
* **Returns:** `Promise<UploadResponse>`

#### `client.generateTryOn(request)`
Triggers the virtual try-on generation.
* **`request`** `VTONRequest`:
  - `model_name` `"fast" | "medium" | "quality"` (Required)
  - `inputClothesImageUrls` `string[]` (Required)
  - `inputPersonImageUrls` `string[]` (Optional)
  - `prompt` `string` (Optional)
  - `version` `number` (Optional)
  - `productId` `string` (Optional)
  - `externalUserId` `string` (Optional)
  - `metadata` `Record<string, any>` (Optional)
* **Returns:** `Promise<VTONResponse>`

#### `client.getHistory(params)`
Retrieves a paginated list of generations.
* **`params`** `VTONHistoryParams`:
  - `userId` `string` (Required)
  - `limit` `number` (Optional, defaults to 20)
  - `startTimestamp` `number` (Optional, UNIX timestamp)
  - `endTimestamp` `number` (Optional, UNIX timestamp)
  - `apiKeyLabel` `string` (Optional)
  - `externalUserId` `string` (Optional)
  - `productId` `string` (Optional)
* **Returns:** `Promise<VTONHistoryResponse>`

---

### User & Account Management

#### `client.registerUser(user)`
Registers a developer user and allocates initial free credits.
* **`user`** `UserRegistrationRequest`: `{ emailId, name, userId, companyName?, phoneNumber? }`

#### `client.getUserCredits(userId)`
Fetch the credit balance for a specific user ID.

#### `client.getProfileDetails(userId)`
Retrieve profile metadata, credit balances, account type, and tier information.

#### `client.updateProfile(userId, profile)`
Update profile details simultaneously (name, companyName, phoneNumber).

#### `client.deleteAccount(userId)`
Delete a user and wipe all database documents associated with their `userId` (including gallery items, photoshoot uploads, try-on logs, orders, and auth).

#### `client.getSubscriptionStatus(userId)`
Fetch active recurring plan details, tier, ending timestamps, and transaction IDs.

---

### API Key Management

#### `client.generateApiKey(userId, label)`
Generates a new API key for developer integrations.
* **`label`** `string`: A custom name to identify the key (e.g. `my-production-key`).

#### `client.listApiKeys(userId)`
List all API keys created by a user.

#### `client.revokeApiKey(userId, keyId)`
Permanently revoke and delete an API key, preventing future usage.

---

## ⚠️ Error Handling

The SDK exposes custom error classes mapping to the API status codes.

```typescript
import {
  VTONError,
  InvalidAPIKeyError,
  UnauthorizedError,
  UserNotFoundError,
  APIKeyNotFoundError,
  InsufficientCreditsError,
  VTONServerError
} from 'snapit_sdk';
```

| Exception | HTTP Status | Description |
| :--- | :--- | :--- |
| `InvalidAPIKeyError` | `401` | Missing, incorrect, or revoked `X-API-Key` header. |
| `UnauthorizedError` | `403` | User ID specified in request does not match key owner. |
| `UserNotFoundError` | `404` | Specified `userId` does not exist. |
| `APIKeyNotFoundError` | `404` | API key reference query failed to find any record. |
| `InsufficientCreditsError`| `501` | Credit balance is lower than model execution cost. |
| `VTONServerError` | `5xx` | VTON backend failed or timed out. |

---

## 🏃 Running the Example

The SDK includes a runnable example file to quickly demonstrate capabilities.

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Set your API key environment variable:
   ```bash
   export SMD_API_KEY="smd_live_your_api_key"
   ```
3. Run the demo:
   ```bash
   npm run example
   ```

---

## 📄 License

Apache-2.0
