import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

async function globalSetup() {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
  
  console.log('Setting up test environment...');
  
  try {    
    console.log('Test environment setup complete!');
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    process.exit(1);
  }
}

export default globalSetup;