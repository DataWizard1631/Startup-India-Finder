"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function TestPage() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        console.log("Fetching hackathons data...")
        const res = await fetch("/api/hackathons")
        
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
        }
        
        const data = await res.json()
        console.log(`Received ${Array.isArray(data) ? data.length : 0} hackathons`)
        setHackathons(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
        setHackathons([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading hackathon data...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h1>
        <p className="mb-4">{error}</p>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px]">
          {error.stack || "No stack trace available"}
        </pre>
        <div className="mt-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hackathon Test Page</h1>
        <p className="text-gray-500">Found {hackathons.length} hackathons</p>
      </div>

      <div className="space-y-6">
        {hackathons.length > 0 ? (
          hackathons.map((hackathon) => (
            <div key={hackathon.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-2">{hackathon.title}</h2>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {hackathon.mode || "N/A"}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{hackathon.desc || "No description available"}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.isArray(hackathon.sectorTags) && hackathon.sectorTags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p>{hackathon.date || "No date specified"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p>{hackathon.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Organizer</p>
                  <p>{hackathon.organiser || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-gray-500">ID</p>
                  <p className="truncate">{hackathon.id}</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-4">
                {hackathon.link && (
                  <a 
                    href={hackathon.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      // Ensure the URL has proper http/https prefix
                      let url = hackathon.link;
                      if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        url = 'https://' + url;
                      }
                      window.open(url, '_blank');
                    }}
                  >
                    View Details →
                  </a>
                )}
                <button 
                  className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 inline-flex items-center"
                  onClick={() => {
                    alert(JSON.stringify(hackathon, null, 2));
                  }}
                >
                  Debug Info
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-xl text-gray-500">No hackathons found</p>
            <p className="mt-2 text-gray-400">Try running the scraper again</p>
            <div className="mt-4">
              <Link 
                href="/"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
          <pre className="text-xs">{JSON.stringify(hackathons, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
