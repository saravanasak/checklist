import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { sharepointConfig } from '@/config/sharepoint';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: sharepointConfig.clientId,
    authority: `https://login.microsoftonline.com/${sharepointConfig.tenantId}`,
    redirectUri: typeof window !== 'undefined' ? window.location.origin : ''
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};

// Microsoft Graph scopes needed for file operations
const scopes = ['Files.ReadWrite', 'Sites.ReadWrite.All'];

/**
 * Custom authentication provider for Microsoft Graph client
 */
class MsalAuthProvider implements AuthenticationProvider {
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  /**
   * Get access token for Microsoft Graph API
   */
  async getAccessToken(): Promise<string> {
    try {
      // Try to get token silently first
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const silentRequest = {
          scopes,
          account: accounts[0]
        };

        try {
          const response = await this.msalInstance.acquireTokenSilent(silentRequest);
          return response.accessToken;
        } catch (error) {
          // If silent token acquisition fails, fall back to interactive method
          if (error instanceof InteractionRequiredAuthError) {
            const interactiveRequest = {
              scopes
            };
            const response = await this.msalInstance.acquireTokenPopup(interactiveRequest);
            return response.accessToken;
          }
          throw error;
        }
      } else {
        // No accounts found, need to login
        const loginRequest = {
          scopes
        };
        const response = await this.msalInstance.loginPopup(loginRequest);
        if (response.account) {
          const tokenRequest = {
            scopes,
            account: response.account
          };
          const tokenResponse = await this.msalInstance.acquireTokenSilent(tokenRequest);
          return tokenResponse.accessToken;
        }
        throw new Error('Login successful but no account was found');
      }
    } catch (error) {
      console.error('Error acquiring token:', error);
      throw error;
    }
  }
}

/**
 * SharePoint service for file operations
 */
export class SharePointService {
  private client: Client;
  private authProvider: MsalAuthProvider;

  constructor() {
    this.authProvider = new MsalAuthProvider();
    this.client = Client.initWithMiddleware({
      authProvider: this.authProvider
    });
  }

  /**
   * Upload a file to SharePoint
   * @param fileName Name of the file to upload
   * @param fileContent File content as Blob
   * @returns Promise with the uploaded file details
   */
  async uploadFile(fileName: string, fileContent: Blob): Promise<any> {
    try {
      // Ensure the user is authenticated
      await this.authProvider.getAccessToken();

      // Build the API URL for the upload
      // Format: /sites/{site-id}/drives/{drive-id}/root:/{folder-path}/{file-name}:/content
      const uploadUrl = `/sites/${sharepointConfig.siteId}/drives/${sharepointConfig.driveId}/root:/${sharepointConfig.folderPath}/${fileName}:/content`;

      // Upload the file
      const response = await this.client.api(uploadUrl)
        .put(fileContent);

      console.log('File uploaded successfully:', response);
      return response;
    } catch (error) {
      console.error('Error uploading file to SharePoint:', error);
      throw error;
    }
  }

  /**
   * Check if user is logged in to Microsoft
   * @returns Boolean indicating if user is logged in
   */
  isLoggedIn(): boolean {
    const msalInstance = new PublicClientApplication(msalConfig);
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0;
  }

  /**
   * Login to Microsoft
   */
  async login(): Promise<void> {
    const msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.loginPopup({ scopes });
  }

  /**
   * Logout from Microsoft
   */
  async logout(): Promise<void> {
    const msalInstance = new PublicClientApplication(msalConfig);
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      await msalInstance.logoutPopup({
        account: accounts[0]
      });
    }
  }
}

// Export a singleton instance only if SharePoint integration is enabled and we're in the browser
const sharepointService = typeof window !== 'undefined' && sharepointConfig.enabled ? new SharePointService() : null;
export default sharepointService;
