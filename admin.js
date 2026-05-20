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

  if(frame){

    frame.src = frame.src;

  }

}

// ======================================
// IMAGE PREVIEW
// ======================================

function previewLogo(event){

  const image =
    document.getElementById('logoPreview');

  if(!event.target.files[0]) return;

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
      .from('church-media')
      .upload(fileName, file);

  if(error){

    console.error(error);

    alert('Image upload failed');

    return null;

  }

  // GET PUBLIC URL
  const { data } =
    supabaseClient
      .storage
      .from('church-media')
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

  // WEBSITE SETTINGS
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

  // OPTIONAL FIELDS
  if(document.getElementById('facebookLink')){

    document.getElementById('facebookLink').value =
      data.facebook_link || '';

  }

  if(document.getElementById('youtubeLink')){

    document.getElementById('youtubeLink').value =
      data.youtube_link || '';

  }

  if(document.getElementById('emailLink')){

    document.getElementById('emailLink').value =
      data.email_link || '';

  }

  if(document.getElementById('heroBackground')){

    document.getElementById('heroBackground').value =
      data.hero_background || '';

  }

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

  const facebookLink =
    document.getElementById('facebookLink')?.value || '';

  const youtubeLink =
    document.getElementById('youtubeLink')?.value || '';

  const emailLink =
    document.getElementById('emailLink')?.value || '';

  const heroBackground =
    document.getElementById('heroBackground')?.value || '';

  // LOGO
  const logoFile =
    document.getElementById('logoInput').files[0];

  let logoUrl = null;

  if(logoFile){

    logoUrl =
      await uploadImage(logoFile);

  }

  // UPDATE DATA
  const updateData = {

    church_name:churchName,
    church_subtitle:churchSubtitle,

    hero_title:heroTitle,
    hero_description:heroDescription,

    about_title:aboutTitle,
    about_description:aboutDescription,

    sunday_service:sundayService,
    midweek_service:midweekService,

    footer_text:footerText,

    facebook_link:facebookLink,
    youtube_link:youtubeLink,
    email_link:emailLink,

    hero_background:heroBackground

  };

  // UPDATE LOGO ONLY IF NEW
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

  loadSermonsAdmin();

  refreshPreview();

}

// ======================================
// LOAD SERMONS ADMIN
// ======================================

async function loadSermonsAdmin(){

  const container =
    document.getElementById('sermonsAdminList');

  if(!container) return;

  const { data, error } =
    await supabaseClient
      .from('sermons')
      .select('*')
      .order('created_at', {
        ascending:false
      });

  if(error){

    console.error(error);

    return;

  }

  container.innerHTML = '';

  data.forEach((sermon)=>{

    container.innerHTML += `

      <div class="bg-[#181818] text-white border border-white/10 rounded-3xl p-6">

        <img
          src="${sermon.image_url}"
          class="w-full h-52 object-cover rounded-2xl"
        />

        <p class="text-yellow-400 text-sm uppercase tracking-[0.2em] mt-5">
          ${sermon.category || ''}
        </p>

        <h3 class="text-2xl font-black mt-3">
          ${sermon.title || ''}
        </h3>

        <button
          onclick="deleteSermon(${sermon.id})"
          class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition"
        >
          Delete Sermon
        </button>

      </div>

    `;

  });

}

// ======================================
// DELETE SERMON
// ======================================

async function deleteSermon(id){

  const confirmDelete =
    confirm('Delete this sermon?');

  if(!confirmDelete) return;

  const { error } =
    await supabaseClient
      .from('sermons')
      .delete()
      .eq('id', id);

  if(error){

    console.error(error);

    alert('Failed to delete sermon');

    return;

  }

  alert('Sermon deleted');

  loadSermonsAdmin();

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

  loadEventsAdmin();

  refreshPreview();

}

// ======================================
// LOAD EVENTS ADMIN
// ======================================

async function loadEventsAdmin(){

  const container =
    document.getElementById('eventsAdminList');

  if(!container) return;

  const { data, error } =
    await supabaseClient
      .from('events')
      .select('*')
      .order('created_at', {
        ascending:false
      });

  if(error){

    console.error(error);

    return;

  }

  container.innerHTML = '';

  data.forEach((event)=>{

    container.innerHTML += `

      <div class="bg-[#181818] text-white border border-white/10 rounded-3xl p-6">

        <p class="text-yellow-400 text-sm uppercase tracking-[0.2em]">
          ${event.event_date || ''}
        </p>

        <h3 class="text-2xl font-black mt-3">
          ${event.title || ''}
        </h3>

        <p class="text-zinc-400 mt-4 leading-relaxed">
          ${event.description || ''}
        </p>

        <button
          onclick="deleteEvent(${event.id})"
          class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition"
        >
          Delete Event
        </button>

      </div>

    `;

  });

}

// ======================================
// DELETE EVENT
// ======================================

async function deleteEvent(id){

  const confirmDelete =
    confirm('Delete this event?');

  if(!confirmDelete) return;

  const { error } =
    await supabaseClient
      .from('events')
      .delete()
      .eq('id', id);

  if(error){

    console.error(error);

    alert('Failed to delete event');

    return;

  }

  alert('Event deleted');

  loadEventsAdmin();

  refreshPreview();

}

// ======================================
// CREATE MINISTRY
// ======================================

async function createMinistry(){

  const icon =
    document.getElementById('ministryIcon').value;

  const title =
    document.getElementById('ministryTitle').value;

  const description =
    document.getElementById('ministryDescription').value;

  if(!title){

    alert('Please enter ministry title');

    return;

  }

  const { error } =
    await supabaseClient
      .from('ministries')
      .insert([{

        icon:icon,
        title:title,
        description:description

      }]);

  if(error){

    console.error(error);

    alert('Failed to create ministry');

    return;

  }

  alert('Ministry added successfully!');

  // CLEAR
  document.getElementById('ministryIcon').value = '';
  document.getElementById('ministryTitle').value = '';
  document.getElementById('ministryDescription').value = '';

  loadMinistriesAdmin();

  refreshPreview();

}

// ======================================
// LOAD MINISTRIES ADMIN
// ======================================

async function loadMinistriesAdmin(){

  const container =
    document.getElementById('ministriesAdminList');

  if(!container) return;

  const { data, error } =
    await supabaseClient
      .from('ministries')
      .select('*')
      .order('created_at', {
        ascending:false
      });

  if(error){

    console.error(error);

    return;

  }

  container.innerHTML = '';

  data.forEach((ministry)=>{

    container.innerHTML += `

      <div class="bg-[#181818] text-white border border-white/10 rounded-3xl p-6">

        <div class="text-5xl">
          ${ministry.icon || '✨'}
        </div>

        <h3 class="text-2xl font-black mt-5">
          ${ministry.title || ''}
        </h3>

        <p class="text-zinc-400 mt-4 leading-relaxed">
          ${ministry.description || ''}
        </p>

        <button
          onclick="deleteMinistry(${ministry.id})"
          class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition"
        >
          Delete Ministry
        </button>

      </div>

    `;

  });

}

// ======================================
// DELETE MINISTRY
// ======================================

async function deleteMinistry(id){

  const confirmDelete =
    confirm('Delete this ministry?');

  if(!confirmDelete) return;

  const { error } =
    await supabaseClient
      .from('ministries')
      .delete()
      .eq('id', id);

  if(error){

    console.error(error);

    alert('Failed to delete ministry');

    return;

  }

  alert('Ministry deleted');

  loadMinistriesAdmin();

  refreshPreview();

}

// ======================================
// INITIALIZE
// ======================================

loadWebsiteSettings();
loadSermonsAdmin();
loadEventsAdmin();
loadMinistriesAdmin();
