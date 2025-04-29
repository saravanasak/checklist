/**
 * SharePoint and Microsoft Graph API configuration
 * 
 * These values should be set in your .env.local file
 */

export const sharepointConfig = {
  // Azure AD Application (client) ID
  clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
  
  // Azure AD Tenant ID
  tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID || '',
  
  // SharePoint site ID
  siteId: process.env.NEXT_PUBLIC_SHAREPOINT_SITE_ID || '',
  
  // SharePoint drive ID (document library)
  driveId: process.env.NEXT_PUBLIC_SHAREPOINT_DRIVE_ID || '',
  
  // Path within the document library to store files
  folderPath: process.env.NEXT_PUBLIC_SHAREPOINT_FOLDER_PATH || 'Employee Checklists',
  
  // Whether SharePoint integration is enabled
  enabled: process.env.NEXT_PUBLIC_ENABLE_SHAREPOINT === 'true'
};
