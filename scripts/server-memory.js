#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// In-memory data store (will reset when the server restarts)
let memoryStore = {};

// Persistent storage file
const STORAGE_FILE = path.join(process.cwd(), '.claude-memory.json');

// Load existing memory from file if it exists
try {
  if (fs.existsSync(STORAGE_FILE)) {
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    memoryStore = JSON.parse(data);
    console.error(`Loaded memory from ${STORAGE_FILE}`);
  }
} catch (error) {
  console.error(`Error loading memory file: ${error.message}`);
  // Continue with empty memory store
}

// Save memory to persistent storage
const saveMemory = () => {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving memory: ${error.message}`);
  }
};

// Handle memory operations
const handleRequest = async (request) => {
  try {
    const { type, params } = JSON.parse(request);
    
    if (type === 'metadata') {
      // Return metadata for the memory server
      return JSON.stringify({
        type: 'result',
        result: {
          name: 'Memory',
          description: 'Persistent memory for Claude to store and retrieve information across sessions',
          methods: {
            store: {
              description: 'Store a value in memory',
              params: {
                key: { type: 'string', description: 'Key to store the value under' },
                value: { type: 'any', description: 'Value to store' },
                namespace: { 
                  type: 'string', 
                  description: 'Optional namespace for organizing memories',
                  required: false,
                  default: 'default'
                }
              }
            },
            retrieve: {
              description: 'Retrieve a value from memory',
              params: {
                key: { type: 'string', description: 'Key to retrieve' },
                namespace: { 
                  type: 'string', 
                  description: 'Namespace to retrieve from',
                  required: false,
                  default: 'default'
                }
              }
            },
            list: {
              description: 'List all keys in a namespace',
              params: {
                namespace: { 
                  type: 'string', 
                  description: 'Namespace to list keys from',
                  required: false,
                  default: 'default'
                }
              }
            },
            delete: {
              description: 'Delete a key from memory',
              params: {
                key: { type: 'string', description: 'Key to delete' },
                namespace: { 
                  type: 'string', 
                  description: 'Namespace to delete from',
                  required: false,
                  default: 'default'
                }
              }
            }
          }
        }
      });
    } else if (type === 'method') {
      const { method, params: methodParams } = params;
      
      // Initialize namespace if it doesn't exist
      const namespace = methodParams.namespace || 'default';
      if (!memoryStore[namespace]) {
        memoryStore[namespace] = {};
      }
      
      if (method === 'store') {
        const { key, value } = methodParams;
        memoryStore[namespace][key] = value;
        saveMemory();
        
        return JSON.stringify({
          type: 'result',
          result: { success: true, message: `Stored value for key '${key}' in namespace '${namespace}'` }
        });
      } else if (method === 'retrieve') {
        const { key } = methodParams;
        const value = memoryStore[namespace][key];
        
        if (value === undefined) {
          return JSON.stringify({
            type: 'result',
            result: { found: false, message: `No value found for key '${key}' in namespace '${namespace}'` }
          });
        }
        
        return JSON.stringify({
          type: 'result',
          result: { found: true, value }
        });
      } else if (method === 'list') {
        const keys = Object.keys(memoryStore[namespace] || {});
        
        return JSON.stringify({
          type: 'result',
          result: { keys, namespace }
        });
      } else if (method === 'delete') {
        const { key } = methodParams;
        const existed = memoryStore[namespace] && key in memoryStore[namespace];
        
        if (existed) {
          delete memoryStore[namespace][key];
          saveMemory();
        }
        
        return JSON.stringify({
          type: 'result',
          result: { success: existed, message: existed ? `Deleted key '${key}' from namespace '${namespace}'` : `Key '${key}' not found in namespace '${namespace}'` }
        });
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

// Send ready message when server starts
console.log(JSON.stringify({ type: 'ready' }));