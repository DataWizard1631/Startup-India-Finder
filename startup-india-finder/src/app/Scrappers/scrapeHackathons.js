const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const URL = "https://devfolio.co/hackathons";

async function scrapeHackathons() {
  try {
    console.log(`Fetching hackathons from ${URL}...`);
    
    // Fetch data from the target URL with appropriate headers to avoid blocking
    const { data } = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    console.log('Data fetched successfully, parsing...');
    const $ = cheerio.load(data);

    const hackathons = [];
    let count = 0;

    // Devfolio structure: Look for hackathon cards
    // This is an approximation - we'll need to inspect the actual HTML structure
    $('div[class*="HackathonCard"], div[class*="hackathon-card"], .hackathon-item').each((_, el) => {
      try {
        // Try different selectors that might contain the title
        const title = $(el).find('h2, h3, [class*="title"], [class*="name"]').first().text().trim();
        // Try different selectors that might contain the description
        const description = $(el).find('p, [class*="description"], [class*="content"]').first().text().trim();
        // Try different selectors that might contain the date
        const dateText = $(el).find('[class*="date"], [class*="time"], time').first().text().trim();
        // Parse date or use today + 30 days as fallback
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 30); // Default to 30 days from now
        const date = dateText || dateObj.toISOString().split('T')[0];
        
        // Get link if available
        let link = $(el).find('a').attr('href') || URL;
        
        // Ensure link has proper protocol
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          // Handle relative links
          if (link.startsWith('/')) {
            link = `https://devfolio.co${link}`;
          } else {
            link = `https://${link}`;
          }
        }
        
        // Final link with proper formatting
        const fullLink = link;
        
        // Extract location if available
        const location = $(el).find('[class*="location"], [class*="place"]').text().trim() || 'Virtual';
        
        // Extract tags if available
        const tagsElements = $(el).find('[class*="tag"], [class*="category"], [class*="badge"]');
        const tags = [];
        tagsElements.each((_, tagEl) => {
          tags.push($(tagEl).text().trim());
        });
        
        // Generate ID
        const id = fullLink.split('/').filter(Boolean).pop() || Math.random().toString(36).substring(2, 10);
        
        // Only add if we have at least a title
        if (title) {
          count++;
          hackathons.push({
            id,
            title,
            desc: description || `A hackathon hosted on Devfolio. Click to learn more.`, 
            date,
            mode: location.toLowerCase().includes('virtual') ? 'Online' : 'Hybrid',
            location: location || 'Virtual',
            sectorTags: tags.length > 0 ? tags : ['Technology', 'Development'],
            organiser: 'Devfolio',
            link: fullLink
          });
        }
      } catch (err) {
        console.error(`Error parsing hackathon:`, err.message);
      }
    });
    
    console.log(`Found ${count} hackathons on the page`);
    
    // If no hackathons were found with the main selector, try alternate selectors
    if (hackathons.length === 0) {
      console.log('No hackathons found with primary selectors, trying alternates...');
      
      // Look for any blocks that might be hackathon cards
      $('div.card, div[class*="Card"], article, section > div').each((_, el) => {
        try {
          const title = $(el).find('h1, h2, h3, h4, .title, .heading').first().text().trim();
          const description = $(el).find('p, .description, .content, .text').first().text().trim();
          let link = $(el).find('a').attr('href') || URL;
          
          // Properly format the link with protocol
          if (!link.startsWith('http://') && !link.startsWith('https://')) {
            if (link.startsWith('/')) {
              link = `https://devfolio.co${link}`;
            } else {
              link = `https://${link}`;
            }
          }
          
          if (title && (title.toLowerCase().includes('hack') || title.toLowerCase().includes('challenge'))) {
            const id = Math.random().toString(36).substring(2, 10);
            hackathons.push({
              id,
              title,
              desc: description || `A hackathon hosted on Devfolio. Click to learn more.`,
              date: new Date().toISOString().split('T')[0], // Today's date as fallback
              mode: 'Online',
              location: 'Virtual',
              sectorTags: ['Technology'],
              organiser: 'Devfolio',
              link: link
            });
          }
        } catch (err) {
          console.error(`Error parsing with alternate selector:`, err.message);
        }
      });
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write data to file
    const filePath = path.join(dataDir, "hackathons.json");
    fs.writeFileSync(filePath, JSON.stringify(hackathons, null, 2));
    console.log(`✅ Successfully scraped ${hackathons.length} hackathons and saved to ${filePath}`);
    return hackathons;
  } catch (err) {
    console.error("❌ Scraper failed:", err.message);
    throw err;
  }
}

scrapeHackathons();
