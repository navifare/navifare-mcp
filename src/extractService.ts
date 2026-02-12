import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODEL } from './config/aiModel.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || 'dummy-key-for-development'
);

// Convert the frontend extract function to work in Node.js environment
export async function extractFlightDetails(imageBase64: string, mimeType: string = "image/jpeg"): Promise<any> {
  try {
    console.log('🔑 API Key configured:', !!process.env.GEMINI_API_KEY);
    
    // Check if we have a real API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.');
    }
    
    // Validate base64 data
    if (!imageBase64 || imageBase64.length < 100) {
      throw new Error('Invalid image data. Please provide a valid base64-encoded image.');
    }
    
    // Get current year/date dynamically
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const prompt = `
Analyze this flight booking screenshot and extract comprehensive flight details. Return ONLY a valid JSON object with the following exact structure:

{
  "tripType": "one_way" | "round_trip",
  "cabinClass": "economy" | "premium_economy" | "business" | "first",
  "passengers": {
    "adults": NUMBER,
    "children": NUMBER,
    "infants": NUMBER
  },
  "outboundSegments": [
    {
      "airline": "AIRLINE_NAME",
      "flightNumber": "FULL_FLIGHT_NUMBER_WITH_PREFIX",
      "departure": "DEPARTURE_AIRPORT_CODE",
      "arrival": "ARRIVAL_AIRPORT_CODE", 
      "departureTime": "HH:MM",
      "arrivalTime": "HH:MM",
      "date": "YYYY-MM-DD",
      "flightDuration": "HH:MM"
    }
  ],
  "returnSegments": [
    // Same structure as outboundSegments, only if round trip
  ],
  "totalPrice": NUMBER,
  "currency": "CURRENCY_CODE"
}

CRITICAL: PRICE AND CURRENCY EXTRACTION IS ESSENTIAL!
Look very carefully for pricing information:
- Total prices in any format: €299, $450, £320, ¥50000, 299.99, etc.
- Currency symbols: €, $, £, ¥, CHF, CAD, etc.
- Currency codes: EUR, USD, GBP, JPY, CHF, CAD, AUD, etc.
- Price labels: "Total", "Price", "Cost", "Amount", "Fare", etc.
- Any numerical values that could be prices
- Tax inclusive/exclusive prices
- Per person vs total prices
- If there are multiple prices, extract the cheapest one you find

IMPORTANT EXTRACTION RULES:
1. Trip Type: **ALWAYS SET TO "round_trip"** - One-way trips are not supported. If you detect a one-way booking, still set tripType to "round_trip" but note this in the response.
2. Cabin Class: Look for class indicators like "Economy", "Business", "Premium", "First"
3. Passengers: Extract number of adults, children, infants carefully:
   - Look for explicit passenger count indicators: "2 adults", "2 passengers", "per person", "total for X people"
   - If you see per-person price and total price (e.g., "$249/person, $497 total"), calculate passenger count: totalPrice ÷ perPersonPrice = passenger count
   - Do NOT default to 1 adult if passenger count is clearly visible in the screenshot
   - Only default to 1 adult if passenger count is truly unclear
4. **SEGMENT CLASSIFICATION - CRITICAL: Extract ALL flights visible**:
   - You MUST extract every flight segment you see in the screenshot, even if there are multiple flights
   - Look for ALL flight information blocks, cards, or sections (e.g., "Flight to Athens", "Flight to London")
   - Do NOT stop after extracting the first flight - continue until you've extracted all visible flights
   - IGNORE text that says "One-way tickets" - this is just explaining pricing structure, NOT the trip type
   
   ROUND-TRIP CLASSIFICATION:
   - If you see flights going from A → B AND B → A (returns to origin) → round_trip
   - Example: LGW → ATH (first flight), ATH → LGW (second flight) = round_trip
   - If the second flight's arrival airport matches the first flight's departure airport → it's a return flight
   - Look for visual indicators: "Flight to [City]" and "Flight to [Origin City]", "Return", "Back", "Round trip"
   - If you see two separate flights going in opposite directions → it's round_trip
   
   SEGMENT ASSIGNMENT:
   - For ROUND TRIPS: All flights from origin city to destination city go in "outboundSegments" (including connecting flights)
   - For ROUND TRIPS: All flights from destination city back to origin city go in "returnSegments" (including connecting flights)
   - For ONE-WAY TRIPS DETECTED: All flights go in "outboundSegments", "returnSegments" should be empty array, but set tripType to "round_trip" and add a note
   - **MULTI-SEGMENT FLIGHTS**: If there are connecting flights, each flight leg is a separate segment in the same direction
   - **ROUND-TRIP DETECTION**: If the second segment's arrival airport matches the first segment's departure airport, it's a return flight (round-trip)
   - Look for visual indicators: "Return", "Back", "Round trip", airport codes returning to origin
   - If outbound segments end at destination and return segments start at destination, validate round-trip
5. Times: Use 24-hour format (HH:MM). CRITICAL TIME EXTRACTION RULES:
   - When you see times in 12-hour format with AM/PM indicators (e.g., "1:55 PM", "10:45 PM", "12:30 AM"), carefully identify the AM/PM indicator
   - Convert 12-hour to 24-hour format correctly:
     * AM times: Keep same (except 12:XX AM becomes 00:XX)
     * PM times: Add 12 hours (except 12:XX PM stays 12:XX)
     * Examples: 1:55 PM → 13:55, 10:45 PM → 22:45, 12:00 AM → 00:00, 12:00 PM → 12:00
   - If you see a time with AM/PM indicator but extract it in 24-hour format, verify the conversion is correct
   - If AM/PM indicator is unclear or missing, mark as lower confidence but still extract the time
6. Airports: Use 3-letter IATA codes only
7. **AIRLINE: Use the full airline name as it appears (e.g., "British Airways", "ITA Airways", "Lufthansa", "Air France")**
8. **FLIGHT NUMBER: MUST extract ONLY the numeric part, excluding the airline prefix**
   - Extract ONLY the numeric digits: "DY816" → "816", "U2 3811" → "3811", "BA553" → "553", "LX 1612" → "1612", "FR100" → "100", "W46011" → "6011"
   - CRITICAL: Flight numbers can be 1-4 digits long. When you see a space between the airline code and numbers (e.g., "U2 3811"), extract ONLY the numeric part: "U2 3811" becomes "3811" (NOT "U23811" or "U2 2"). The airline prefix (2 letters like "U2", "BA", "DY") should NOT be included.
   - Always extract the complete numeric portion - do not truncate or shorten flight numbers.
   - If flight number is not visible or unclear, set to null
9. **FLIGHT DURATION: Extract flight duration in HH:MM format (e.g., "22:30" for 22 hours 30 minutes)**
10. **CURRENCY: MUST extract three letters ISO currency code (EUR, USD, GBP, etc.) - look for symbols or text**
    - If currency symbol "$" is visible → default to "USD"
    - If currency symbol "€" is visible → default to "EUR"
    - For other symbols, convert to ISO code (e.g., £ → GBP, ¥ → JPY)
11. **PRICE: MUST extract numerical price value - remove currency symbols**

**CRITICAL: DO NOT MAKE UP OR GUESS INFORMATION!**
If you cannot clearly identify specific flight information from the image:
- Set airline to null (not abbreviations like "LX")
- Set flightNumber to null (not made-up numbers like "1613") 
- Set departure/arrival to null (not codes like "MXP", "ZRH")
- Set times to null (not times like "10:40", "11:40")
- **DATES: If a date is clearly visible but the year is missing, compare month/day to today (${currentDate}). If month/day is later than today, use ${currentYear}; if earlier than today, use ${currentYear + 1}. If a date shows a past year OR if the date (even with current year) is in the past, replace it with ${currentYear + 1} (next year). If no date is visible or unclear, set to null. Dates must never be in the past.**
- Set currency to null (if no currency visible)
- Set totalPrice to null (if no price visible)
- IF IT'S CLEAR THAT THE USER DIDN'T PASTE A FLIGHT, RETURN ALL FIELDS TO NULL.

AIRLINE NAME EXTRACTION:
- Extract the full airline name as it appears in the image
- Look for airline logos, text, or branding
- Examples: "British Airways", "Lufthansa", "Air France", "ITA Airways", "Swiss International Air Lines"
- Do NOT use abbreviations like "BA", "LH", "AF", "AZ", "LX"
`;

    console.log('📷 Processing image with Gemini...');
    
    const model = genAI.getGenerativeModel({ model: AI_MODEL });
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Received response from Gemini API');
    
    // Try to parse the JSON response
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log('🧹 Cleaned response text');
      
      // Check if the response contains flight-related content
      if (!cleanedText.includes('tripType') && !cleanedText.includes('outboundSegments')) {
        // The AI might have returned an error message or non-flight content
        if (cleanedText.toLowerCase().includes('sorry') || 
            cleanedText.toLowerCase().includes('cannot') || 
            cleanedText.toLowerCase().includes('unable') ||
            cleanedText.toLowerCase().includes('no flight') ||
            cleanedText.toLowerCase().includes('not found')) {
          throw new Error('The AI could not find flight information in this image. Please make sure the image contains a clear flight booking screenshot with airline details, flight numbers, dates, and pricing information.');
        }
        
        // Check if it's empty or very short
        if (cleanedText.length < 50) {
          throw new Error('The image appears to be empty or contains no readable flight information. Please upload a clear screenshot of your flight booking.');
        }
        
        throw new Error('The AI could not extract flight details from this image. Please ensure the image contains a clear flight booking confirmation with all necessary details visible.');
      }
      
      const extractedData = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed JSON response');
      
      // Post-process to handle one-way trips
      const isOneWayDetected = extractedData.returnSegments === null || 
                             extractedData.returnSegments === undefined || 
                             (Array.isArray(extractedData.returnSegments) && extractedData.returnSegments.length === 0);
      
      if (isOneWayDetected) {
        console.log('⚠️ One-way trip detected - forcing round trip structure');
        // Force round trip structure
        extractedData.tripType = 'round_trip';
        extractedData.returnSegments = [];
        
        // Add a note about the one-way detection
        extractedData.oneWayDetected = true;
        extractedData.oneWayMessage = 'One-way trip detected. Return flights are required but not found in the booking. Please add return flight details manually.';
      }
      
      // Add metadata
      extractedData.extractionMetadata = {
        timestamp: new Date().toISOString(),
        model: AI_MODEL,
        confidence: 'high',
        oneWayDetected: isOneWayDetected
      };
      
      // Convert the result to the format expected by submit_session
      return convertToSubmitSessionFormat(extractedData);
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', parseError);
      throw new Error('Failed to parse flight details from image. The AI could not extract valid flight information.');
    }
  } catch (error) {
    console.error('❌ Error extracting flight details:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract flight details: ${error.message}`);
    }
    throw new Error('Failed to extract flight details from image. Please ensure the image contains clear flight booking information.');
  }
}

// Convert FlightDetails to the format expected by submit_session
function convertToSubmitSessionFormat(flightDetails: any): any {
  const segments: any[] = [];
  
  // Process outbound segments
  if (flightDetails.outboundSegments && Array.isArray(flightDetails.outboundSegments)) {
    flightDetails.outboundSegments.forEach((segment: any) => {
      segments.push({
        airline: segment.airline || '',
        flightNumber: segment.flightNumber || '',
        departureAirport: segment.departure || '',
        arrivalAirport: segment.arrival || '',
        departureDate: segment.date || '',
        departureTime: segment.departureTime || '',
        arrivalTime: segment.arrivalTime || '',
        plusDays: calculatePlusDays(segment.departureTime, segment.arrivalTime)
      });
    });
  }
  
  // Process return segments
  if (flightDetails.returnSegments && Array.isArray(flightDetails.returnSegments)) {
    flightDetails.returnSegments.forEach((segment: any) => {
      segments.push({
        airline: segment.airline || '',
        flightNumber: segment.flightNumber || '',
        departureAirport: segment.departure || '',
        arrivalAirport: segment.arrival || '',
        departureDate: segment.date || '',
        departureTime: segment.departureTime || '',
        arrivalTime: segment.arrivalTime || '',
        plusDays: calculatePlusDays(segment.departureTime, segment.arrivalTime)
      });
    });
  }
  
  return {
    legs: [{
      segments: segments
    }],
    travelClass: flightDetails.cabinClass || 'economy',
    adults: flightDetails.passengers?.adults || 1,
    children: flightDetails.passengers?.children || 0,
    infantsInSeat: 0, // Default to 0, could be enhanced
    infantsOnLap: flightDetails.passengers?.infants || 0,
    source: 'image-extraction',
    price: flightDetails.totalPrice || '',
    currency: flightDetails.currency || 'USD',
    location: 'Unknown' // Could be enhanced with location detection
  };
}

// Calculate plusDays based on departure and arrival times
function calculatePlusDays(departureTime: string, arrivalTime: string): number {
  if (!departureTime || !arrivalTime) return 0;
  
  try {
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    const depMinutes = depHour * 60 + depMin;
    const arrMinutes = arrHour * 60 + arrMin;
    
    // If arrival time is earlier than departure time, it's next day
    if (arrMinutes < depMinutes) {
      return 1;
    }
    
    return 0;
  } catch {
    return 0;
  }
}
