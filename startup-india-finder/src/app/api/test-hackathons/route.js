import { NextResponse } from 'next/server';
import { mockHackathons } from '../../test/mockData';

export async function GET() {
  try {
    // Simulate a short network delay for testing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return the mock data
    return NextResponse.json(mockHackathons);
  } catch (error) {
    console.error('Error in test hackathons API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test hackathons data' },
      { status: 500 }
    );
  }
}
