// ======================================
// SUPABASE
// ======================================

const SUPABASE_URL =
"https://hhjvvxyulavdxhxcxkcz.supabase.co";

const SUPABASE_ANON_KEY =
"YOUR_SUPABASE_ANON_KEY";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

// ======================================
// REFRESH WEBSITE PREVIEW
// ======================================

function refreshPreview(){

  const frame =
    document.getElementById('previewFrame');

  frame.src = frame.src;

}

// ======================================
// IMAGE PREVIEW
// ======================================

function previewLogo(event){

  const image =
    document.getElementById('logoPreview');

  image.src =
    URL.createObjectURL(event.target.files[0]);

  image.classList.remove('hidden');

}

// ======================================
// UPLOAD IMAGE
// ======================================

async function uploadImage(file){

  if(!file) return null;

  const fileName =
    `${Date.now()}-${file.name}`;

  // UPLOAD
  const { error } =
    await supabaseClient
      .storage
      .
