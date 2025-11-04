# ChatGPT Usage Guide for Navifare MCP Tools

## Overview

The Navifare MCP server provides three powerful tools for flight price comparison and analysis. This guide helps ChatGPT understand when and how to use each tool effectively.

## Tool Descriptions & Usage Patterns

### 1. `format_flight_pricecheck_request` - Natural Language Parser

**When to use**: When the user mentions a flight they found and wants to check for better prices, but hasn't provided structured flight data.

**Example user inputs**:
- "I found LX 1612 from MXP to FCO on Nov 4th at 6:40 PM for 150 EUR"
- "I saw a flight from New York to London on December 15th for $500"
- "Can you find a better price for Swiss Air flight 123 from Zurich to Paris?"

**What it does**:
- Parses natural language flight descriptions
- Extracts flight details using AI
- Asks follow-up questions if information is missing
- Automatically triggers price comparison once all details are collected

**Output**: Either requests more information or automatically proceeds with price comparison.

---

### 2. `extract_flight_from_image` - Image Analysis Tool

**When to use**: When the user uploads screenshots of flight bookings, itineraries, or confirmation emails.

**Example user inputs**:
- User uploads a screenshot of a flight booking page
- User shares a confirmation email image
- User shows an itinerary from an airline app

**What it does**:
- Analyzes images using AI vision
- Extracts flight details (airline, flight numbers, dates, times, prices)
- Automatically searches for better prices
- Returns comparison results

**Output**: Flight details extracted from images + price comparison results.

---

### 3. `flight_pricecheck` - Direct Price Comparison

**When to use**: When you have complete, structured flight data and want to search for better prices.

**Required data structure**:
```json
{
  "trip": {
    "legs": [
      {
        "segments": [
          {
            "airline": "LX",
            "flightNumber": "1612",
            "departureAirport": "MXP",
            "arrivalAirport": "FCO",
            "departureDate": "2025-11-04",
            "departureTime": "18:40:00",
            "arrivalTime": "20:05:00",
            "plusDays": 0
          }
        ]
      }
    ],
    "travelClass": "ECONOMY",
    "adults": 1,
    "children": 0,
    "infantsInSeat": 0,
    "infantsOnLap": 0
  },
  "source": "ChatGPT",
  "price": "150.00",
  "currency": "EUR"
}
```

**What it does**:
- Searches multiple booking sources
- Finds cheaper alternatives for the exact same flight
- Returns detailed comparison results with savings information

---

## ChatGPT Usage Patterns

### Pattern 1: User mentions a flight conversationally
```
User: "I found a flight from Milan to Rome for 150 euros"
ChatGPT: Use `format_flight_pricecheck_request` with the user's description
```

### Pattern 2: User uploads an image
```
User: [Uploads screenshot of flight booking]
ChatGPT: Use `extract_flight_from_image` with the uploaded image
```

### Pattern 3: You have structured flight data
```
ChatGPT: Use `flight_pricecheck` with the complete flight data structure
```

## Key Guidelines for ChatGPT

### 1. Always Ask for Complete Information
If the user provides incomplete flight details, use `format_flight_pricecheck_request` to parse what they have and ask for missing information.

### 2. Handle Different Input Formats
Users might provide flight information in various formats:
- "LX 1612 from MXP to FCO"
- "Swiss Air flight 1612 from Milan to Rome"
- "Flight departing Milan at 6:40 PM"

### 3. Explain the Process
Always explain to users what you're doing:
- "I'm analyzing your flight details..."
- "I'm searching for better prices across multiple booking sites..."
- "I found several alternatives for your flight..."

### 4. Handle Missing Information Gracefully
If information is missing, ask specific questions:
- "What's the departure time for your flight?"
- "Which airline are you flying with?"
- "What's the return date for your round-trip?"

### 5. Provide Context
Help users understand what the tools do:
- "I can help you find better prices for flights you've already found"
- "I can analyze flight booking screenshots to extract details"
- "I'll search across multiple booking sites to find cheaper alternatives"

## Common User Scenarios

### Scenario 1: Price Comparison Request
```
User: "I found a flight from New York to London for $500, can you find something cheaper?"
ChatGPT: Use `format_flight_pricecheck_request` to parse the details and search for alternatives.
```

### Scenario 2: Image Upload
```
User: [Uploads flight booking screenshot]
ChatGPT: Use `extract_flight_from_image` to analyze the image and automatically search for better prices.
```

### Scenario 3: Detailed Flight Information
```
User: "I'm looking at American Airlines flight 100 from JFK to LHR on December 15th at 8:00 AM, returning on December 22nd at 2:00 PM for $600"
ChatGPT: Use `format_flight_pricecheck_request` to parse this detailed information and search for alternatives.
```

## Error Handling

### Common Issues and Solutions

1. **Missing Flight Details**: Use `format_flight_pricecheck_request` to ask for missing information
2. **Invalid Image Format**: Explain that images should be flight booking screenshots or itineraries
3. **API Errors**: Provide helpful error messages and suggest alternatives

### Fallback Strategies

1. If image extraction fails, ask the user to provide flight details manually
2. If natural language parsing fails, ask for specific information in a structured format
3. If price comparison fails, explain the issue and suggest trying again

## Best Practices

### 1. Be Proactive
- Always offer to help with flight price comparison
- Suggest using the tools when users mention flights
- Explain the benefits of price comparison

### 2. Be Clear About Limitations
- Explain that the tools work with specific flights users have already found
- Mention that results depend on current availability and pricing
- Clarify that the tools compare prices for the exact same flight details

### 3. Provide Value
- Always explain the savings found
- Show multiple alternatives when available
- Help users understand the trade-offs between different options

### 4. Use Natural Language
- Communicate in a friendly, helpful tone
- Explain technical processes in simple terms
- Ask follow-up questions to clarify user needs

## Example Conversations

### Example 1: Natural Language Input
```
User: "I found a flight from Paris to Tokyo for 800 euros"
ChatGPT: "I can help you find better prices for that flight! Let me analyze the details you provided and search for alternatives across multiple booking sites."
[Uses format_flight_pricecheck_request]
```

### Example 2: Image Upload
```
User: [Uploads flight booking screenshot]
ChatGPT: "I can see you've uploaded a flight booking screenshot. Let me analyze the flight details and automatically search for better prices for you."
[Uses extract_flight_from_image]
```

### Example 3: Detailed Information
```
User: "I'm looking at British Airways flight 286 from LHR to JFK on January 15th at 10:30 AM, returning on January 22nd at 6:00 PM for $650"
ChatGPT: "Perfect! I have all the details I need. Let me search for better prices for your British Airways flight from London to New York."
[Uses format_flight_pricecheck_request, then flight_pricecheck]
```

## Technical Notes

### Data Format Requirements
- All dates must be in YYYY-MM-DD format
- Times must be in HH:MM:SS format
- Airport codes must be 3-letter IATA codes
- Airline codes must be 2-letter IATA codes
- Prices must be numeric strings with 2 decimal places

### API Integration
- The tools automatically handle data transformation
- Error handling is built into the server
- Results are returned in a user-friendly format

### Performance Considerations
- Image analysis may take 10-30 seconds
- Price comparison typically takes 5-15 seconds
- Natural language parsing is usually instant

This guide should help ChatGPT understand when and how to use each tool effectively, providing users with the best possible flight price comparison experience.

