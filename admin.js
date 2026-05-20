// ======================================
// SUPABASE
// ======================================

const SUPABASE_URL =
"https://hhjvvxyulavdxhxcxkcz.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_GV8w_hjaScQAhj52JHJGIQ_RRrisZha";

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
      .      .storage
      .from('church-images')
      .upload(fileName, file);

  if(error){
    console.error(error);
    alert('Upload failed');
    return null;
  }

  // GET PUBLIC URL
  const { data } =
    supabaseClient
      .storage
      .from('church-images')
      .getPublicUrl(fileName);

  return data.publicUrl;

}

// ======================================
// LOAD WEBSITE SETTINGS
// ======================================

async function loadWebsiteSettings(){

  const { data, error } =
    await supabaseClient
      .from('website_settings')
      .select('*')
      .eq('id', 1)
      .single();

  if(error){
    console.error(error);
    return;
  }

  // INPUTS
  document.getElementById('churchName').value =
    data.church_name || '';

  document.getElementById('churchSubtitle').value =
    data.church_subtitle || '';

  document.getElementById('heroTitle').value =
    data.hero_title || '';

  document.getElementById('heroDescription').value =
    data.hero_description || '';

  document.getElementById('aboutTitle').value =
    data.about_title || '';

  document.getElementById('aboutDescription').value =
    data.about_description || '';

  document.getElementById('sundayService').value =
    data.sunday_service || '';

  document.getElementById('midweekService').value =
    data.midweek_service || '';

  document.getElementById('footerText').value =
    data.footer_text || '';

  // LOGO
  if(data.logo_url){

    const logoPreview =
      document.getElementById('logoPreview');

    logoPreview.src =
      data.logo_url;

    logoPreview.classList.remove('hidden');

  }

}

// ======================================
// UPDATE WEBSITE SETTINGS
// ======================================

async function updateWebsiteSettings(){

  const churchName =
    document.getElementById('churchName').value;

  const churchSubtitle =
    document.getElementById('churchSubtitle').value;

  const heroTitle =
    document.getElementById('heroTitle').value;

  const heroDescription =
    document.getElementById('heroDescription').value;

  const aboutTitle =
    document.getElementById('aboutTitle').value;

  const aboutDescription =
    document.getElementById('aboutDescription').value;

  const sundayService =
    document.getElementById('sundayService').value;

  const midweekService =
    document.getElementById('midweekService').value;

  const footerText =
    document.getElementById('footerText').value;

  // LOGO FILE
  const logoFile =
    document.getElementById('logoInput').files[0];

  let logoUrl = null;

  // UPLOAD IF HAS FILE
  if(logoFile){

    logoUrl =
      await uploadImage(logoFile);

  }

  // UPDATE DATABASE
  const updateData = {

    church_name:churchName,
    church_subtitle:churchSubtitle,

    hero_title:heroTitle,
    hero_description:heroDescription,

    about_title:aboutTitle,
    about_description:aboutDescription,

    sunday_service:sundayService,
    midweek_service:midweekService,

    footer_text:footerText

  };

  // ONLY UPDATE LOGO IF EXISTS
  if(logoUrl){

    updateData.logo_url =
      logoUrl;

  }

  const { error } =
    await supabaseClient
      .from('website_settings')
      .update(updateData)
      .eq('id', 1);

  if(error){

    console.error(error);
    alert('Failed to update website');

    return;

  }

  alert('Website updated successfully!');

  refreshPreview();

}

// ======================================
// CREATE SERMON
// ======================================

async function createSermon(){

  const title =
    document.getElementById('sermonTitle').value;

  const category =
    document.getElementById('sermonCategory').value;

  const video =
    document.getElementById('sermonVideo').value;

  const imageFile =
    document.getElementById('sermonImage').files[0];

  if(!title || !imageFile){

    alert('Please complete sermon fields');
    return;

  }

  // UPLOAD IMAGE
  const imageUrl =
    await uploadImage(imageFile);

  const { error } =
    await supabaseClient
      .from('sermons')
      .insert([{

        title:title,
        category:category,
        image_url:imageUrl,
        video_link:video

      }]);

  if(error){

    console.error(error);
    alert('Failed to publish sermon');

    return;

  }

  alert('Sermon published successfully!');

  // CLEAR INPUTS
  document.getElementById('sermonTitle').value = '';
  document.getElementById('sermonCategory').value = '';
  document.getElementById('sermonVideo').value = '';
  document.getElementById('sermonImage').value = '';

  refreshPreview();

}

// ======================================
// CREATE EVENT
// ======================================

async function createEvent(){

  const title =
    document.getElementById('eventTitle').value;

  const eventDate =
    document.getElementById('eventDate').value;

  const description =
    document.getElementById('eventDescription').value;

  if(!title){

    alert('Please enter event title');
    return;

  }

  const { error } =
    await supabaseClient
      .from('events')
      .insert([{

        title:title,
        event_date:eventDate,
        description:description

      }]);

  if(error){

    console.error(error);
    alert('Failed to create event');

    return;

  }

  alert('Event created successfully!');

  // CLEAR
  document.getElementById('eventTitle').value = '';
  document.getElementById('eventDate').value = '';
  document.getElementById('eventDescription').value = '';

  refreshPreview();

}

// ======================================
// INITIALIZE
// ======================================

loadWebsiteSettings();
