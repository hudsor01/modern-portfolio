#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for reading from stdin and writing to stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Function to handle server-side file system operations
const handleRequest = async (request) => {
  try {
    const { type, params } = JSON.parse(request);
    
    if (type === 'metadata') {
      // Return metadata for the server
      return JSON.stringify({
        type: 'result',
        result: {
          name: 'ServerFilesystem',
          description: 'Server-side filesystem operations',
          methods: {
            listFiles: {
              description: 'List files in a directory',
              params: {
                directory: { type: 'string', description: 'Directory path to list' }
              }
            },
            readFile: {
              description: 'Read content of a file',
              params: {
                filePath: { type: 'string', description: 'Path to the file to read' }
              }
            }
          }
        }
      });
    } else if (type === 'method') {
      const { method, params: methodParams } = params;
      
      if (method === 'listFiles') {
        const { directory } = methodParams;
        const dirPath = path.resolve(process.cwd(), directory);
        
        try {
          const files = await fs.promises.readdir(dirPath);
          const fileStats = await Promise.all(
            files.map(async (file) => {
              const filePath = path.join(dirPath, file);
              const stats = await fs.promises.stat(filePath);
              return {
                name: file,
                path: filePath,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                modified: stats.mtime
              };
            })
          );
          
          return JSON.stringify({
            type: 'result',
            result: fileStats
          });
        } catch (error) {
          return JSON.stringify({
            type: 'error',
            error: `Failed to list directory: ${error.message}`
          });
        }
      } else if (method === 'readFile') {
        const { filePath } = methodParams;
        const resolvedPath = path.resolve(process.cwd(), filePath);
        
        try {
          const content = await fs.promises.readFile(resolvedPath, 'utf8');
          return JSON.stringify({
            type: 'result',
            result: { content }
          });
        } catch (error) {
          return JSON.stringify({
            type: 'error',
            error: `Failed to read file: ${error.message}`
          });
        }
      } else {
        return JSON.stringify({
          type: 'error',
          error: `Unknown method: ${method}`
        });
      }
    } else {
      return JSON.stringify({
        type: 'error',
        error: 'Invalid request type'
      });
    }
  } catch (error) {
    return JSON.stringify({
      type: 'error',
      error: error.message
    });
  }
};

// Process each line of input
rl.on('line', async (line) => {
  try {
    const response = await handleRequest(line);
    console.log(response);
  } catch (error) {
    console.log(JSON.stringify({
      type: 'error',
      error: error.message
    }));
  }
});

// Send initial ready message when server starts
console.log(JSON.stringify({ type: 'ready' }));