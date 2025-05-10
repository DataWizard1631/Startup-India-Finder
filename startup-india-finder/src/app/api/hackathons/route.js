import { NextResponse } from 'next/server';
import fs from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Use proper path resolution for the data file
    const dataPath = join(process.cwd(), 'data/hackathons.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const hackathons = JSON.parse(data);
    
    return NextResponse.json(hackathons);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hackathons data' },
      { status: 500 }
    );
  }
}
