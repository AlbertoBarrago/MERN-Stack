# Guide for Writing Effective GitHub Issues

This guide will help you write clear, actionable issues for both frontend and backend components of the MERN Blueprint project.

## General Guidelines

1. **Be specific and concise** - Clearly state what the issue is without unnecessary details
2. **One issue per report** - Don't combine multiple bugs or features in a single issue
3. **Use descriptive titles** - A good title summarizes the issue in a few words
4. **Follow the templates** - Use the provided issue templates for consistency
5. **Include all required information** - Complete all relevant sections in the templates

## Writing Frontend Issues

### For Bug Reports

1. **Detailed reproduction steps**
   - List exact steps to reproduce the issue
   - Include navigation paths (e.g., "From the dashboard, click on Profile")
   - Mention any specific user actions (clicks, form inputs, etc.)

2. **Visual evidence**
   - Include screenshots or screen recordings when possible
   - Highlight the problematic area in screenshots

3. **Browser console errors**
   - Check your browser's developer tools (F12) for errors
   - Copy and paste the full error message, including stack traces

4. **State management context**
   - If applicable, describe the state of the application when the bug occurs
   - Mention any relevant user authentication status or data dependencies

### Example of a Good Frontend Bug Report

```
[FE BUG] User profile image fails to update after upload

Bug Description:
After uploading a new profile image, the UI shows a success message but the profile image doesn't update until page refresh.

Reproduction Steps:
1. Log in as any user
2. Go to Profile page
3. Click "Change Profile Picture"
4. Select an image and click "Upload"
5. See success message "Image uploaded successfully"
6. Notice the profile image still shows the old image

Expected Behavior:
The profile image should update immediately after successful upload.

Console Errors:
Error in console: "TypeError: Cannot read property 'url' of undefined at ProfileImage.jsx:42"
```

## Writing Backend Issues

### For Bug Reports

1. **API details**
   - Specify the exact endpoint with HTTP method (e.g., `GET /api/users/profile`)
   - Include request headers, especially authentication tokens (redact sensitive information)
   - Include the full request payload/body

2. **Response information**
   - Include the HTTP status code received
   - Include the complete response body
   - Note any unexpected response headers

3. **Server context**
   - Mention relevant server logs if available
   - Note any database queries that might be related
   - Specify environment variables that might affect the issue (without revealing secrets)

4. **Authentication context**
   - Specify if the issue occurs with specific user roles or permissions
   - Note if authentication is involved in the issue

### Example of a Good Backend Bug Report

```
[BE BUG] User profile update returns 500 error when email contains plus sign

Bug Description:
When updating a user profile with an email containing a plus sign (e.g., user+tag@example.com), the API returns a 500 error instead of updating the profile.

API Endpoint:
PUT /api/users/profile

Reproduction Steps:
1. Authenticate as any user
2. Send PUT request to /api/users/profile
3. Include email with plus sign in the request body: {"email": "user+tag@example.com"}
4. Receive 500 error response

Request Details:
- Method: PUT
- Headers: 
  - Authorization: Bearer [valid-token]
  - Content-Type: application/json
- Body: {"email": "user+tag@example.com"}

Expected Response:
200 OK with updated user profile

Actual Response:
500 Internal Server Error
Body: {"message": "Server Error"}

Server Logs:
Error: ValidationError: email: Path `email` is invalid (user+tag@example.com).
```

## Feature Requests

When requesting new features:

1. **Focus on the problem, not just the solution**
   - Explain what user need or business requirement this addresses
   - Describe the current limitations or pain points

2. **Provide context**
   - Explain who would benefit from this feature
   - Describe how it fits into the existing application

3. **Be realistic about scope**
   - Consider breaking large features into smaller, implementable chunks
   - Think about potential technical challenges

4. **Include visuals for UI features**
   - Mockups or wireframes help communicate UI feature requests
   - Even simple hand-drawn sketches can be valuable

## Final Tips

- **Search before submitting** - Check if your issue has already been reported
- **Be responsive** - Be available to answer questions about your issue
- **Update when needed** - Add new information if you discover more details
- **Be patient** - Issues are prioritized based on project goals and resources

Thank you for contributing to the improvement of the MERN Blueprint project!