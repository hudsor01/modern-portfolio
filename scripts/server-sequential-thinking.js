#!/usr/bin/env node

import readline from 'readline';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Handle the sequential thinking process
const handleRequest = async (request) => {
  try {
    const { type, params } = JSON.parse(request);

    if (type === 'metadata') {
      // Return metadata for the sequential thinking server
      return JSON.stringify({
        type: 'result',
        result: {
          name: 'SequentialThinking',
          description: 'Allows Claude to think step-by-step about complex problems',
          methods: {
            think: {
              description: 'Process complex problems step by step',
              params: {
                problem: {
                  type: 'string',
                  description: 'The problem or question to analyze',
                },
                context: {
                  type: 'string',
                  description: 'Additional context or constraints',
                  required: false,
                },
                steps: {
                  type: 'number',
                  description: 'Number of steps to break down the thinking process',
                  required: false,
                  default: 5,
                },
              },
            },
          },
        },
      });
    } else if (type === 'method') {
      const { method, params: methodParams } = params;

      if (method === 'think') {
        const { problem, context = '', steps = 5 } = methodParams;

        // The actual step-by-step thinking will be handled by Claude
        // This just gives the model a structured prompt to work with
        return JSON.stringify({
          type: 'result',
          result: {
            problemStatement: problem,
            context: context,
            requestedSteps: steps,
            instructions:
              'Please break down your thinking process into clear sequential steps. For each step, provide your reasoning and any intermediate conclusions. This helps organize complex problem-solving in a structured way.',
          },
        });
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
