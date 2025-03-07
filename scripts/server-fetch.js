#!/usr/bin/env node

const readline = require('readline');
const https = require('https');
const http = require('http');
const URL = require('url').URL;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Fetch data from a URL with appropriate error handling
const fetchUrl = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // Parse URL to determine if http or https
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      // Set sensible defaults for timeout
      const requestOptions = {
        ...options,
        timeout: options.timeout || 10000, // 10 second default timeout
      };

      const req = client.get(url, requestOptions, (res) => {
        const { statusCode } = res;

        // Handle redirects (up to 5 levels)
        if (
          (statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) &&
          options.redirectCount < 5 &&
          res.headers.location
        ) {
          return resolve(
            fetchUrl(res.headers.location, {
              ...options,
              redirectCount: (options.redirectCount || 0) + 1,
            })
          );
        }

        // Handle HTTP errors
        if (statusCode < 200 || statusCode >= 300) {
          return reject(new Error(`Request failed with status code ${statusCode}`));
        }

        // Collect response data
        const contentType = res.headers['content-type'];
        let rawData = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          rawData += chunk;
        });

        res.on('end', () => {
          try {
            const result = {
              status: statusCode,
              headers: res.headers,
              data: rawData,
              contentType,
            };

            // Try to parse JSON if applicable
            if (contentType && contentType.includes('application/json')) {
              try {
                result.json = JSON.parse(rawData);
              } catch (e) {
                // Couldn't parse as JSON, leave as raw data
              }
            }

            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Handle fetch requests
const handleRequest = async (request) => {
  try {
    const { type, params } = JSON.parse(request);

    if (type === 'metadata') {
      // Return metadata for the fetch server
      return JSON.stringify({
        type: 'result',
        result: {
          name: 'Fetch',
          description: 'Fetches data from URLs with HTTP/HTTPS',
          methods: {
            get: {
              description: 'Fetch data from a URL using GET method',
              params: {
                url: {
                  type: 'string',
                  description: 'URL to fetch data from',
                },
                headers: {
                  type: 'object',
                  description: 'HTTP headers to include in the request',
                  required: false,
                },
                timeout: {
                  type: 'number',
                  description: 'Request timeout in milliseconds',
                  required: false,
                  default: 10000,
                },
              },
            },
          },
        },
      });
    } else if (type === 'method') {
      const { method, params: methodParams } = params;

      if (method === 'get') {
        const { url, headers = {}, timeout = 10000 } = methodParams;

        try {
          // Only allow fetching from trusted domains for security
          const parsedUrl = new URL(url);
          const allowedDomains = [
            'api.github.com',
            'jsonplaceholder.typicode.com',
            'api.openweathermap.org',
            'api.openai.com',
            'api.anthropic.com',
            'dummyjson.com',
            'fakestoreapi.com',
          ];

          // Check if the domain is allowed
          if (
            !allowedDomains.some(
              (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith('.' + domain)
            )
          ) {
            return JSON.stringify({
              type: 'error',
              error: `Fetching from domain '${parsedUrl.hostname}' is not allowed for security reasons`,
            });
          }

          const result = await fetchUrl(url, { headers, timeout, redirectCount: 0 });

          return JSON.stringify({
            type: 'result',
            result,
          });
        } catch (error) {
          return JSON.stringify({
            type: 'error',
            error: `Failed to fetch URL: ${error.message}`,
          });
        }
      } else {
        return JSON.stringify({
          type: 'error',
          error: `Unknown method: ${method}`,
        });
      }
    } else {
      return JSON.stringify({
        type: 'error',
        error: 'Invalid request type',
      });
    }
  } catch (error) {
    return JSON.stringify({
      type: 'error',
      error: error.message,
    });
  }
};

// Process each line of input
rl.on('line', async (line) => {
  try {
    const response = await handleRequest(line);
    console.log(response);
  } catch (error) {
    console.log(
      JSON.stringify({
        type: 'error',
        error: error.message,
      })
    );
  }
});

// Send ready message when server starts
console.log(JSON.stringify({ type: 'ready' }));
