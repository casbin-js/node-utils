# Casbin.js Server Utilities for Node-Casbin

If you are using [Casbin.js](https://github.com/casbin/casbin.js) at your frontend and [Node-Casbin](https://github.com/casbin/node-casbin) as your backend Casbin service, you can install this package at your backend. This package provides a wrapper for generating the user profile passed to Casbin.js at the frontend.

### Installation
```
npm install --save casbinjs-server-tool
# or
yarn add casbinjs-server-tool
```

### Example

```javascript
import CasbinServerTool from 'casbinjs-server-tool'

// In your Restful API
private async setRouter(): Promise<void> {
    this.app.get('/api/casbin', async (req: express.Request, res: express.Response) => {
        // Get the user identity from URL.
        const user = String(req.query["casbin_user"]);

        // Initialize the casbin server tool with casbin enforcer
        const casbinSvrTool = new CasbinServerTool(enforcer);
        
        // Generate the user's profile
        const profile = casbinSvrTool.genJsonProfile(user);

        // Return the response to the client-side.
        res.status(200).json({
            message: 'ok',
            data: profile
        })
    })
}
```
