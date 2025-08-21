import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
Deno.serve(async (req)=>{
  console.log("MAL series insert trigger called");
  // Debug environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  console.log("SUPABASE_URL exists:", !!supabaseUrl);
  console.log("SERVICE_ROLE_KEY exists:", !!serviceRoleKey);
  console.log("URL value:", supabaseUrl); // Remove this after testing
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405
    });
  }
  try {
    // Parse webhook payload
    const payload = await req.json();
    console.log("Webhook payload received");
    const record = payload.record;
    if (!record) {
      throw new Error("No record found in webhook payload");
    }
    // Create Supabase client with service role
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    // Generate unique slug
    const baseSlug = generateSlug(record.title);
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);
    console.log("Generated unique slug:", uniqueSlug);
    let processedPictureUrl = record.main_picture;
    // Download and store image if URL exists
    if (record.main_picture && typeof record.main_picture === 'string') {
      try {
        console.log("Downloading image from:", record.main_picture);
        // Download the image
        const imageResponse = await fetch(record.main_picture);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        // Generate filename
        const fileExtension = getFileExtension(record.main_picture) || 'jpg';
        const fileName = `series/${uniqueSlug}/main-picture.${fileExtension}`;
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage.from('pictures') // Make sure this bucket exists
        .upload(fileName, imageBuffer, {
          contentType: imageBlob.type,
          cacheControl: '3600',
          upsert: true
        });
        if (uploadError) {
          console.error("Upload error:", uploadError);
        // Continue with original URL if upload fails
        } else {
          console.log("Image uploaded successfully:", uploadData.path);
          // Get public URL
          const { data: { publicUrl } } = supabase.storage.from('pictures').getPublicUrl(fileName);
          processedPictureUrl = publicUrl;
          console.log("New image URL:", processedPictureUrl);
        }
      } catch (imageError) {
        console.error("Image processing failed:", imageError);
      // Continue with original URL if image processing fails
      }
    }
    // Insert into series table with processed image URL
    const { data, error } = await supabase.from('series').insert([
      {
        name: record.title,
        korean_name: record.alternative_titles?.ja,
        slug: uniqueSlug,
        picture: processedPictureUrl,
        synopsis: record.synopsis.replace('[Written by MAL Rewrite]', '').replace(/\(Source: .*\)$/, ''),
        popularity: record.popularity,
        genres: record.genres,
        authors: record.authors,
        num_chapters: record.num_chapters
      }
    ]);
    if (error) {
      console.error("Database insert error:", error);
      return new Response(JSON.stringify({
        error: error.message,
        details: error
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 400
      });
    }
    console.log("Series inserted successfully");
    return new Response(JSON.stringify({
      success: true,
      data,
      processedImage: processedPictureUrl !== record.main_picture
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
// Helper function to extract file extension from URL
function getFileExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const lastDot = pathname.lastIndexOf('.');
    return lastDot !== -1 ? pathname.slice(lastDot + 1).toLowerCase() : null;
  } catch  {
    return null;
  }
}
// Helper function to generate a slug from title
function generateSlug(title) {
  return title.toLowerCase().trim() // Replace spaces and special characters with hyphens
  .replace(/[^\w\s-]/g, '') // Replace multiple spaces/hyphens with single hyphen
  .replace(/[\s_-]+/g, '-') // Remove leading/trailing hyphens
  .replace(/^-+|-+$/g, '') // Limit length
  .substring(0, 50);
}
// Helper function to ensure slug uniqueness
async function ensureUniqueSlug(supabase, baseSlug) {
  let slug = baseSlug;
  let counter = 1;
  while(true){
    // Check if slug exists
    const { data, error } = await supabase.from('series').select('slug').eq('slug', slug).single();
    if (error && error.code === 'PGRST116') {
      // No row found - slug is unique
      return slug;
    } else if (data) {
      // Slug exists, try with counter
      slug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      // Some other error occurred
      console.error('Error checking slug uniqueness:', error);
      return `${baseSlug}-${Date.now()}`; // Fallback to timestamp
    }
    // Prevent infinite loop
    if (counter > 1000) {
      return `${baseSlug}-${Date.now()}`;
    }
  }
}
