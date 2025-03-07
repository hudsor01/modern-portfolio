#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Setup the MCP server for MCPCard component
const handleRequest = async (request) => {
  try {
    const { type, params } = JSON.parse(request);

    if (type === 'render') {
      // Return the TSX code for rendering the MCPCard component
      return JSON.stringify({
        type: 'result',
        result: {
          code: getMCPCardCode(params),
        },
      });
    } else if (type === 'metadata') {
      // Return component metadata
      return JSON.stringify({
        type: 'result',
        result: {
          name: 'MCPCard',
          description: 'A modern card component with icon and animation',
          params: {
            title: { type: 'string', description: 'Title of the card' },
            description: { type: 'string', description: 'Description of the card' },
            icon: {
              type: 'string',
              enum: ['briefcase', 'monitor', 'chart', 'spreadsheet'],
              description: 'Icon to display in the card',
            },
            variant: {
              type: 'string',
              enum: ['default', 'outline', 'secondary'],
              description: 'Visual style variant of the card',
              default: 'default',
            },
            href: {
              type: 'string',
              description: 'Optional link URL for the card',
              required: false,
            },
          },
        },
      });
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

// Generate the MCPCard component code
function getMCPCardCode(params) {
  const { title, description, icon, variant = 'default', href } = params;

  // Generate the component with the provided props
  return `<MCPCard
  title="${title}"
  description="${description}"
  icon="${icon}"
  ${variant !== 'default' ? `variant="${variant}"` : ''}
  ${href ? `href="${href}"` : ''}
/>`;
}

// Handle incoming requests
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

// Send initial ready message
console.log(JSON.stringify({ type: 'ready' }));
