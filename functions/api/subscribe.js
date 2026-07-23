export async function onRequestPost(context) {
 // Cloudflare Pages Function for email subscription
 // Handles POST requests to /api/subscribe
 
 try {
 const request = context.request;
 const env = context.env;
 
 // Only allow POST requests
 if (request.method !== 'POST') {
 return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
 status: 405,
 headers: { 'Content-Type': 'application/json' }
 });
 }
 
 // Parse the request body
 let data;
 try {
 data = await request.json();
 } catch (e) {
 return new Response(JSON.stringify({ error: 'Invalid JSON in request body.' }), {
 status: 400,
 headers: { 'Content-Type': 'application/json' }
 });
 }
 
 const { email } = data;
 
 // Validate email
 if (!email || typeof email !== 'string') {
 return new Response(JSON.stringify({ error: 'Email is required.' }), {
 status: 400,
 headers: { 'Content-Type': 'application/json' }
 });
 }
 
 // Basic email format validation
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 return new Response(JSON.stringify({ error: 'Please provide a valid email address.' }), {
 status: 400,
 headers: { 'Content-Type': 'application/json' }
 });
 }
 
 // Validate InsForge API key exists
 if (!env.INSFORGE_API_KEY) {
 return new Response(JSON.stringify({ 
 error: 'Server configuration error. Please check server logs.',
 details: 'API key not configured.' 
 }), {
 status: 500,
 headers: { 'Content-Type': 'application/json' }
 });
 }
 
 // Prepare data for InsForge API
 const insforgeData = {
 project_id: env.INSFORGE_PROJECT_ID || 'tayoca-newsletter',
 email: email.trim(),
 subscribed_at: new Date().toISOString(),
 source: 'tayoca.com'
 };
 
 // Use the correct InsForge PostgREST endpoint
 const tableName = 'newsletter_subscribers';
 const insforgeResponse = await fetch(`${env.INSFORGE_API_BASE}/api/database/records/${tableName}`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${env.INSFORGE_API_KEY}`
 },
 body: JSON.stringify([insforgeData])
 });
 
 if (!insforgeResponse.ok) {
 const errorDetail = (await insforgeResponse.json())?.error || 'Unknown error';
 return new Response(JSON.stringify({ 
 error: 'Failed to subscribe to newsletter.',
 details: errorDetail 
 }), {
 status: 502,
 headers: { 'Content-Type': 'application/json' }
 });
 }
 
 // Success! Return success response
 return new Response(JSON.stringify({ 
 success: true,
 message: 'Successfully subscribed to newsletter!',
 email: email
 }), {
 status: 200,
 headers: { 'Content-Type': 'application/json' }
 });
 
 } catch (error) {
 console.error('Subscription error:', error);
 return new Response(JSON.stringify({ 
 error: 'An unexpected error occurred.',
 details: process.env.NODE_ENV === 'development' ? error.message : undefined
 }), {
 status: 500,
 headers: { 'Content-Type': 'application/json' }
 });
 }
}