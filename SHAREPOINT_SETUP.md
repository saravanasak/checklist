# SharePoint Integration Setup Guide

This guide explains how to set up the SharePoint integration for the Employee Checklist application, which allows saving signed checklist PDFs directly to a SharePoint folder.

## Prerequisites

1. A Microsoft Azure account with admin access to create applications
2. A SharePoint site where you want to store the checklist PDFs
3. Appropriate permissions to access the SharePoint site and create/upload files

## Step 1: Register an Azure AD Application

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Enter a name for your application (e.g., "Employee Checklist App")
5. Set the supported account type to **Accounts in this organizational directory only**
6. Set the Redirect URI to **Web** and enter your application's URL (e.g., `https://your-app-domain.com`)
7. Click **Register**
8. Once created, note down the **Application (client) ID** and **Directory (tenant) ID** from the overview page

## Step 2: Configure API Permissions

1. In your registered application, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add the following permissions:
   - `Files.ReadWrite`
   - `Sites.ReadWrite.All`
6. Click **Add permissions**
7. Click **Grant admin consent for [Your Organization]**

## Step 3: Get SharePoint Site and Drive IDs

### Get SharePoint Site ID

1. Navigate to your SharePoint site
2. Note the URL (e.g., `https://contoso.sharepoint.com/sites/your-site`)
3. Use the Microsoft Graph Explorer to get the site ID:
   - Go to [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
   - Sign in with your Microsoft account
   - Make a GET request to: `https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/your-site`
   - The response will contain the `id` property - this is your Site ID

### Get Drive ID

1. Once you have the Site ID, make another GET request to:
   `https://graph.microsoft.com/v1.0/sites/{site-id}/drives`
2. This will list all document libraries in the site
3. Find the document library where you want to store the PDFs (usually "Documents" or "Shared Documents")
4. Note the `id` property of this library - this is your Drive ID

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_AZURE_CLIENT_ID=your-application-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_SHAREPOINT_SITE_ID=your-sharepoint-site-id
NEXT_PUBLIC_SHAREPOINT_DRIVE_ID=your-sharepoint-drive-id
NEXT_PUBLIC_SHAREPOINT_FOLDER_PATH=Employee Checklists
NEXT_PUBLIC_ENABLE_SHAREPOINT=true
```

Notes:
- `NEXT_PUBLIC_SHAREPOINT_FOLDER_PATH` is the path within the document library where PDFs will be stored. You can change this to any folder path you prefer.
- Set `NEXT_PUBLIC_ENABLE_SHAREPOINT` to `true` to enable SharePoint integration or `false` to disable it.

## Step 5: Test the Integration

1. Start your application
2. Fill out and submit a checklist form
3. When prompted, sign in with your Microsoft account
4. The PDF should be generated and uploaded to the specified SharePoint folder
5. You should see a confirmation message if the upload was successful

## Troubleshooting

### Authentication Issues

- Ensure the user has appropriate permissions to access the SharePoint site and upload files
- Check that the correct permissions are granted to the Azure AD application
- Verify that admin consent has been granted for the required permissions

### Upload Issues

- Verify that the Site ID and Drive ID are correct
- Ensure the folder path exists in the SharePoint document library
- Check browser console for any error messages during the upload process

### CORS Issues

If you encounter CORS errors:

1. In your Azure AD application, go to **Authentication**
2. Add your application's domain to the list of allowed origins
3. Save the changes

## Security Considerations

- The application uses client-side authentication with MSAL.js, which is suitable for browser-based applications
- All tokens are stored securely in the browser's localStorage
- Users will need to authenticate with their Microsoft account to upload files
- Consider implementing additional security measures for production environments
