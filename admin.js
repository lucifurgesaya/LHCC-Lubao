```javascript
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

  const { error } =
    await supabaseClient
      .storage
      .from('church-media')
      .upload(fileName, file);

  if(error){

    console.error(error);

    alert(error.message);

    return null;

  }

  const { data } =
    supabaseClient
      .storage
      .from('church-media')
      .getPublicUrl(fileName);

  return data.publicUrl;

}

// ======================================
// HELPER
// ======================================

function setValue(id, value){

  const element =
    document.getElementById(id);

  if(element){

    element.value = value || '';

  }

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

  setValue('churchName', data.church_name);
  setValue('churchSubtitle', data.church_subtitle);

  setValue('heroTitle', data.hero_title);
  setValue('heroDescription', data.hero_description);

  setValue('aboutTitle', data.about_title);
  setValue('aboutDescription', data.about_description);

  setValue('sundayService', data.sunday_service);
  setValue('midweekService', data.midweek_service);

  setValue('footerText', data.footer_text);

  setValue('facebookLink', data.facebook_link);
  setValue('youtubeLink', data.youtube_link);
  setValue('emailLink', data.email_link);

  setValue('heroBackground', data.hero_background);

  if(data.logo_url){

    const logoPreview =
      document.getElementById('logoPreview');

    if(logoPreview){

      logoPreview.src =
        data.logo_url;

      logoPreview.classList.remove('hidden');

    }

  }

}

// ======================================
// UPDATE WEBSITE SETTINGS
// ======================================

async function updateWebsiteSettings(){

  const logoFile =
    document.getElementById('logoInput')?.files[0];

  let logoUrl = null;

  if(logoFile){

    logoUrl =
      await uploadImage(logoFile);

  }

  const updateData = {

    church_name:
      document.getElementById('churchName')?.value || '',

    church_subtitle:
      document.getElementById('churchSubtitle')?.value || '',

    hero_title:
      document.getElementById('heroTitle')?.value || '',

    hero_description:
      document.getElementById('heroDescription')?.value || '',

    about_title:
      document.getElementById('aboutTitle')?.value || '',

    about_description:
      document.getElementById('aboutDescription')?.value || '',

    sunday_service:
      document.getElementById('sundayService')?.value || '',

    midweek_service:
      document.getElementById('midweekService')?.value || '',

    footer_text:
      document.getElementById('footerText')?.value || '',

    facebook_link:
      document.getElementById('facebookLink')?.value || '',

    youtube_link:
      document.getElementById('youtubeLink')?.value || '',

    email_link:
      document.getElementById('emailLink')?.value || '',

    hero_background:
      document.getElementById('heroBackground')?.value || ''

  };

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

    alert(error.message);

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

  const imageUrl =
    await uploadImage(imageFile);

  if(!imageUrl) return;

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

    alert(error.message);

    return;

  }

  alert('Sermon published successfully!');

  document.getElementById('sermonTitle').value = '';
  document.getElementById('sermonCategory').value = '';
  document.getElementById('sermonVideo').value = '';
  document.getElementById('sermonImage').value = '';

  loadSermonsAdmin();

  refreshPreview();

}

// ======================================
// PUBLISH EVENT
// ======================================

async function publishEvent(){

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

    alert(error.message);

    return;

  }

  alert('Event published successfully!');

  document.getElementById('eventTitle').value = '';
  document.getElementById('eventDate').value = '';
  document.getElementById('eventDescription').value = '';

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

    alert(error.message);

    return;

  }

  alert('Ministry added successfully!');

  document.getElementById('ministryIcon').value = '';
  document.getElementById('ministryTitle').value = '';
  document.getElementById('ministryDescription').value = '';

  loadMinistriesAdmin();

  refreshPreview();

}

// ======================================
// LOAD SERMONS ADMIN
// ======================================

async function loadSermonsAdmin(){

  const container =
    document.getElementById('sermonsAdminList');

  if(!container) return;

  const { data } =
    await supabaseClient
      .from('sermons')
      .select('*')
      .order('created_at', {
        ascending:false
      });

  container.innerHTML = '';

  data.forEach((sermon)=>{

    container.innerHTML += `

      <div class="bg-[#181818] border border-white/10 rounded-3xl p-6">

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
          class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl"
        >
          Delete Sermon
        </button>

      </div>

    `;

  });

}

// ======================================
// LOAD EVENTS ADMIN
// ======================================

async function loadEventsAdmin(){

  const container =
    document.getElementById('eventsAdminList');

  if(!container) return;

  const { data } =
    await supabaseClient
      .from('events')
      .select('*')
      .order('created_at', {
        ascending:false
      });

  container.innerHTML = '';

  data.forEach((event)=>{

    container.innerHTML += `

      <div class="bg-[#181818] border border-white/10 rounded-3xl p-6">

        <p class="text-yellow-400 text-sm uppercase tracking-[0.2em]">
          ${event.event_date || ''}
        </p>

        <h3 class="text-2xl font-black mt-3">
          ${event.title || ''}
        </h3>

        <p class="text-zinc-400 mt-4">
          ${event.description || ''}
        </p>

        <button
          onclick="deleteEvent(${event.id})"
          class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl"
        >
          Delete Event
        </button>

      </div>

    `;

  });

}

// ======================================
// LOAD MINISTRIES ADMIN
// ======================================

async function loadMinistriesAdmin(){

  const container =
    document.getElementById('ministriesAdminList');

  if(!container) return;

  const { data } =
    await supabaseClient
      .from('ministries')
      .select('*')
      .order('created_at', {
        ascending:false
      });

  container.innerHTML = '';

  data.forEach((ministry)=>{

    container.innerHTML += `

      <div class="bg-[#181818] border border-white/10 rounded-3xl p-6">

        <div class="text-5xl">
          ${ministry.icon || '✨'}
        </div>

        <h3 class="text-2xl font-black mt-5">
          ${ministry.title || ''}
        </h3>

        <p class="text-zinc-400 mt-4">
          ${ministry.description || ''}
        </p>

        <button
          onclick="deleteMinistry(${ministry.id})"
          class="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl"
        >
          Delete Ministry
        </button>

      </div>

    `;

  });

}

// ======================================
// DELETE SERMON
// ======================================

async function deleteSermon(id){

  if(!confirm('Delete this sermon?')) return;

  await supabaseClient
    .from('sermons')
    .delete()
    .eq('id', id);

  loadSermonsAdmin();

  refreshPreview();

}

// ======================================
// DELETE EVENT
// ======================================

async function deleteEvent(id){

  if(!confirm('Delete this event?')) return;

  await supabaseClient
    .from('events')
    .delete()
    .eq('id', id);

  loadEventsAdmin();

  refreshPreview();

}

// ======================================
// DELETE MINISTRY
// ======================================

async function deleteMinistry(id){

  if(!confirm('Delete this ministry?')) return;

  await supabaseClient
    .from('ministries')
    .delete()
    .eq('id', id);

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
```
