import type { HttpContext } from '@adonisjs/core/http'
import YAML from 'yaml'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export default class SwaggerController {
  /**
   * Serve Swagger UI HTML
   */
  async serve({ response }: HttpContext) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hackaton API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      padding: 0;
    }
    .swagger-ui .topbar {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/api-docs.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>
    `

    response.header('Content-Type', 'text/html')
    return response.send(html)
  }

  /**
   * Get OpenAPI JSON spec
   */
  async spec({ response }: HttpContext) {
    const openapiPath = join(process.cwd(), 'openapi.yaml')
    const fileContent = readFileSync(openapiPath, 'utf8')
    const swaggerDocument = YAML.parse(fileContent)

    return response.json(swaggerDocument)
  }
}
