// import css from '!!css-loader!@/style.css';
import css from './style.css?inline'; // assert { type: "css" };
import { passiveIfSupported, createEl, Store, enableConsole } from '@/tools.js';
import pack from '../package.json' assert { type: 'json' };

const cs = enableConsole('cs');
window.cs = cs;

let oldHref = document.location.href;
const body = document.querySelector('body');
const observer = new MutationObserver(() => {
  if (oldHref !== document.location.href) {
    oldHref = document.location.href;
    reInit();
  }
});
observer.observe(body, { childList: true, subtree: true });

const msg = {
  btn: 'Click on the image to copy the video-link to the clipboard',
};

const version = pack.version;
const lsName = 'dl-app'; // name for local storage

let isTouch;
let isOpen = true;
let autoSearch = '';
let store;

let quality = 'Q8C';
let delivery = 'hls';

const styleText = css.toString(); //.replace(/\s+/g, ' ');
let to;

let clearBtnVisible;
let dataObject = [];
let oldSearchString;

// elements
let mainDiv;
let contentDiv;
let bodyInfo;
let searchField;
let closeBtn;
let clearBtn;

let currentActive;

let currentKey;

const getDateFromString = (string) => {
  if (!string) {
    return new Date();
  }
  const ma = string.match(/(\d{4})[_-](\d\d)[_-](\d\d)[_-](\d{4})/);

  if (!ma) {
    return new Date();
  }

  const y = ma[1];
  const m = ma[2];
  const d = ma[3];
  const time = ma[4].slice(0, -2) + ':' + ma[4].slice(2);

  return new Date(`${y}-${m}-${d} ${time}`);
};

const orfOnCleanUp = (obj) => {
  obj.advertising_mapping = {};
  obj.advertising_query_string = '';
  obj.adition_advertising_query_string = '';
  obj.show_display_ads = false;
  obj.show_instream_ads = false;
  obj.disable_display_ads_orf_platforms = true;
  obj.disable_instream_ads_orf_platforms = true;
};

const orfOnFetchData = async () => {
  let count = 0;
  let to;
  return new Promise((resolve, reject) => {
    const get = () => {
      count++;
      const tmp = window.__NUXT__.data;

      const data = Object.entries(tmp);
      let playerObject;
      data.forEach((entry) => {
        const [key, obj] = entry;
        if (obj.sources) {
          playerObject = obj;
          orfOnCleanUp(obj);
          currentKey = key;
          return;
        }
      });

      if (playerObject) {
        count = 0;
        resolve(playerObject);
      } else {
        if (count > 20) {
          clearTimeout(to);
          to = null;
          return reject();
        }
        to = setTimeout(() => get(), 150);
      }
    };
    get();
  });
};

const createOrfOn = (playerObject) => {
  window.playerObject = playerObject;
  const output = [];

  const createOne = (obj, type = 'single') => {
    let link = null;
    let date = obj.date || obj.episode_date;
    date = new Date(date);
    // const d = new Date(obj.date);
    // const date = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;

    // get best hls resource
    obj.sources[delivery].forEach((media) => {
      if ('qxa' === media.quality_key.toLocaleLowerCase()) {
        link = media.src;
      }
    });

    const drm =
      'undefined' !== typeof obj.is_drm_protected ? obj.is_drm_protected : null;

    const ret = {
      type,
      title: obj.headline || obj.title,
      drm,
      date,
      link,
      img:
        obj.image && obj.image.image && obj.image.image.player
          ? obj.image.image.player.url || null
          : null,
    };
    return ret;
  };

  const all = createOne(playerObject, 'all');
  output.push(all);

  if (playerObject.segments) {
    // single
    playerObject.segments.forEach((s) => {
      const segment = createOne(s);
      output.push(segment);
    });
  }

  return output;
};

const createOrfTvthek = () => {
  let output = [];
  let playerObject;
  let playlist;

  const getSource = (sources) => {
    const filtered = sources.filter(
      (source) => source.quality === quality && source.delivery === delivery
    );
    if (0 === filtered.length) {
      return null;
    }
    return filtered[0].src;
  };

  if (
    window.jsb &&
    window.jsb.last_event_values &&
    window.jsb.last_event_values['VideoPlaylist::INITIALIZED']
  ) {
    playerObject = window.jsb.last_event_values['VideoPlaylist::INITIALIZED'];
  } else {
    let data = document.querySelectorAll('.player_viewport [data-jsb]');
    data.forEach((el) => {
      if (el.dataset && el.dataset.jsb) {
        let parsed = JSON.parse(el.dataset.jsb);
        if (parsed.playlist) {
          playerObject = parsed;
          return;
        }
      }
    });
  }

  if (!playerObject) {
    return output;
  }

  playlist = playerObject.playlist;

  let drm = playerObject.drm,
    link,
    img,
    title;

  img = playlist.preview_image_url;
  title = playlist.title;

  const video = playlist.gapless_video;
  // gapless_video given
  if (video) {
    const source = getSource(video.sources);
    if (source) {
      link = source;
    }
  } else {
    // no gapless_video
    let videos = playlist.videos;
    let links = [];
    for (var j = 0; j < videos.length; j++) {
      let video = videos[j];
      const source = getSource(video.sources);
      if (source) {
        link = source;
        links.push(link);
      }
    }

    link = '';
    links.forEach((l, i) => {
      link += 'yt-dlp ' + l + ' -o "' + title + '_' + (i + 1) + '.mp4" && ';
    });

    if (link) {
      link = link.slice(0, -4);
    }
  }

  let date = getDateFromString(playlist.videos[0].sources[0].src);

  output.push({
    type: 'all',
    title,
    drm,
    date,
    link,
    img,
  });

  link = '';
  playlist.videos.forEach((video) => {
    const source = getSource(video.sources);
    if (source) {
      link = source;
    }

    output.push({
      type: 'single',
      title: video.title,
      drm,
      date,
      link,
      img: video.preview_image_url,
    });
  });

  return output;
};

const createDataObject = async (host) => {
  if ('on.orf.at' === host) {
    let playerObject;
    try {
      // playerObject = await dataFetched();
      playerObject = await orfOnFetchData();
    } catch (error) {
      console.log(error);
      return false;
    }
    const result = createOrfOn(playerObject);
    return result;
    // return await createOrfOn();
  } else if ('tvthek.orf.at' === host) {
    return createOrfTvthek();
  }
};

const findData = (inp) => {
  // no filtering, show all
  // if ('' === inp) {
  //   return dataObject;
  // }

  const type = '*' === inp ? 'all' : 'single';
  const filtered = dataObject.filter(
    (item) =>
      item.type === type &&
      ('*' === inp ||
        item.title.toLowerCase().match(inp.replaceAll('*', '.*').toLowerCase()))
  );
  return filtered;
};

const addLeadingZero = (string, max = 2) => ('0' + string).slice(-max);

const contentClicked = (evt) => {
  const t = evt.target;
  if (currentActive) {
    currentActive.classList.remove('active');
    currentActive.querySelector('.my-app-copy').style.display = 'none';
  }

  if (
    'img' === t.nodeName.toLocaleLowerCase() &&
    t.dataset.drm &&
    'false' === t.dataset.drm
  ) {
    const success = imageClicked(evt);
    if (success) {
      const parent = t.parentElement;
      const copy = parent.querySelector('.my-app-copy');
      clearTimeout(to);
      copy.style.display = 'block';
      to = setTimeout(() => {
        parent.classList.add('active');
        parent.classList.add('success');
        to = setTimeout(() => {
          parent.classList.remove('success');
          to = setTimeout(() => {
            copy.style.display = 'none';
          }, 200);
        }, 500);
      }, 1);
      currentActive = parent;
    }
  } else if (
    'button' === t.nodeName.toLocaleLowerCase() &&
    'undefined' !== typeof t.dataset.share
  ) {
    shareButtonClicked(evt);
  }
};

const imageClicked = (evt) => {
  let ta = evt.target.parentElement.nextElementSibling;
  ta.select();
  if (navigator.clipboard) {
    let text = ta.innerHTML;
    return navigator.clipboard.writeText(text).then(
      () => console.log('successful'),
      (err) => console.log('error', err)
    );
  }

  return document.execCommand('copy');
};

const shareButtonClicked = (evt) => {
  if (!navigator.share) {
    return false;
  }
  const t = evt.target;
  const title = t.dataset.shareTitle;
  const url = t.dataset.shareUrl;

  navigator
    .share({
      title,
      url,
    })
    .then(() => console.log('successful share'))
    .catch((error) => console.log('error sharing:', error));
};

const renderSearchResults = (results) => {
  if (!results.length) {
    return null;
  }

  const fragment = new DocumentFragment();
  for (let i = results.length - 1; i >= 0; i--) {
    const obj = results[i];
    const result = createEl('div', { class: 'my-app-result' });
    const bar = createEl('div', { class: 'my-app-bar' });
    const title = createEl('div', { class: 'my-app-title' });
    title.innerHTML = obj.title;
    bar.append(title);

    const textArea = createEl(
      'textarea',
      { class: 'my-app-ta', disabled: 'true' },
      { position: 'absolute', left: '-999em', opacity: 0 }
    );
    const imgWrapper = createEl('div', {
      class: 'my-app-imgWrap',
      title: msg.btn,
    });
    const copyInfo = createEl(
      'div',
      {
        class: 'my-app-copy',
      },
      {
        display: 'none',
      }
    );
    copyInfo.innerHTML = 'copied';
    const img = createEl(
      'img',
      { src: obj.img, width: '150' },
      { flex: 'auto' }
    );
    img.dataset.drm = null === obj.drm ? false : obj.drm;
    imgWrapper.append(img);
    imgWrapper.append(copyInfo);

    let message;
    if (!obj.drm) {
      const y = obj.date.getFullYear();
      const m = addLeadingZero(+obj.date.getMonth() + 1);
      const d = addLeadingZero(obj.date.getDate());
      const hours = addLeadingZero(obj.date.getHours());
      const min = addLeadingZero(obj.date.getMinutes());
      const dateString = `${y}-${m}-${d}`;
      const timeString = `${hours}${min}`;
      let videoTitle = obj.title.toLowerCase().replaceAll('"', '');
      // eslint-disable-next-line quotes
      videoTitle.replaceAll("'", '');
      const name = `${dateString}_${timeString}_${videoTitle}.mp4`;
      message = `yt-dlp ${obj.link} -o '${name}'`;

      const shareButton = createEl('button', { class: 'my-app-shareBtn' });
      shareButton.dataset.share = true;
      shareButton.dataset.shareUrl = obj.link;
      shareButton.title = 'share video link';

      bar.append(shareButton);
    }

    textArea.innerHTML = message;
    result.append(bar);
    result.append(imgWrapper);
    result.append(textArea);
    fragment.append(result);
  }

  contentDiv.append(fragment);
};

const open = () => {
  mainDiv.style.display = 'block';
  to = setTimeout(() => {
    mainDiv.classList.add('open');
    closeBtn.classList.add('open');
    if (searchField) {
      searchField.focus();
    }
    isOpen = true;
    store.set(lsName, { open: isOpen });
    clearTimeout(to);
  }, 1);
};

const close = () => {
  mainDiv.classList.remove('open');
  closeBtn.classList.remove('open');
  to = setTimeout(() => {
    mainDiv.style.display = 'none';
    isOpen = false;
    store.set(lsName, { open: isOpen });
    clearTimeout(to);
  }, 100);
};

const toggle = () => {
  if (isOpen) {
    close();
  } else {
    open();
  }
};

const searchNow = (searchString) => {
  if (oldSearchString === searchString) {
    return;
  }
  // const searchData = '' === searchString ? [] : findData(searchString);
  const searchData = findData(searchString);

  // todo: no update if nothing changed
  contentDiv.innerHTML = '';
  bodyInfo.style.display = searchData.length ? 'block' : 'none';

  renderSearchResults(searchData);

  store.set(lsName, { search: searchString });
  oldSearchString = searchString;
};

const clear = () => {
  searchField.value = '';
  searchField.dispatchEvent(new Event('input'));
  searchField.focus();
};

const toggleClearBtn = (hide) => {
  if (hide) {
    clearBtn.style.display = 'none';
    clearBtnVisible = false;
    return;
  }
  if (!clearBtnVisible) {
    clearBtn.style.display = 'flex';
    clearBtnVisible = true;
  }
};

const onInput = (evt) => {
  const val = evt.currentTarget.value;
  searchNow(val);
  toggleClearBtn('' === val);
};

const getPos = (evt) => {
  let t;
  if ('undefined' !== typeof evt.pageX) {
    t = evt;
  } else {
    t = evt.touches[0] || evt.changedTouches[0];
  }
  return {
    x: t.pageX,
    y: t.pageY,
  };
};

const dragStart = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  if ('touchstart' === evt.type) {
    isTouch = true;
    closeBtn.removeEventListener('mousedown', dragStart);
    window.addEventListener('touchmove', drag, passiveIfSupported);
    window.addEventListener('touchend', dragEnd, false);
  } else if ('mousedown' === evt.type) {
    isTouch = false;
    closeBtn.removeEventListener('touchstart', dragStart);
    window.addEventListener('mousemove', drag, false);
    window.addEventListener('mouseup', dragEnd, false);
  }
};

const drag = (evt) => {
  evt.preventDefault();
  let { x, y } = getPos(evt);
  x = Math.max(0, x);
  y = Math.max(0, y);

  closeBtn.style.left = x + 'px';
  closeBtn.style.top = y + 'px';
};

const dragEnd = (evt) => {
  if ('touchend' === evt.type) {
    isTouch = true;
    window.removeEventListener('touchmove', drag, passiveIfSupported);
    window.removeEventListener('touchend', dragEnd);
  } else if ('mouseup' === evt.type) {
    isTouch = false;
    window.removeEventListener('mousemove', drag, false);
    window.removeEventListener('mouseup', dragEnd, false);
  }
};

const createApp = () => {
  const numberOfVideos = dataObject.length - 1;
  const isSingleVideoPage = numberOfVideos === 1;

  const app = createEl('div', { id: 'my-app' });
  const body = createEl('div', { id: 'my-app-body' });

  mainDiv = createEl('div', { id: 'my-app-box' }, { display: 'none' });
  bodyInfo = createEl('div', { class: 'my-app-info' });
  bodyInfo.innerHTML = msg.btn;

  // no filter option on a single video page
  if (!isSingleVideoPage) {
    bodyInfo.style.display = 'none';

    const header = createEl('div', { id: 'my-app-header' });
    const info = createEl('div', { class: 'my-app-info' });
    info.innerHTML = `Number of Videos: ${numberOfVideos}`;
    header.append(info);

    const filterElement = createEl('div', { id: 'my-app-filter' });

    searchField = createEl('input', {
      type: 'text',
      id: 'my-app-field',
      name: 'fake_user[name]',
      value: '',
      autocomplete: 'new-password',
      spellcheck: 'false',
      'aria-autocomplete': 'none',
      placeholder: 'filter videos by name ...',
    });

    const hint = createEl('div', { class: 'my-app-info' });
    hint.innerHTML = 'Type * to see the full episode/broadcast';

    clearBtn = document.createElement('div');
    clearBtn.id = 'my-app-clear';
    clearBtn.innerHTML = 'X';
    toggleClearBtn(true);

    filterElement.append(searchField);
    filterElement.append(clearBtn);

    header.append(filterElement);
    header.append(hint);

    clearBtn.addEventListener('click', clear, false);
    searchField.addEventListener('input', onInput, false);

    mainDiv.append(header);
  }

  closeBtn = createEl('div', { id: 'my-app-close' });

  closeBtn.addEventListener('click', toggle);
  // closeBtn.addEventListener('touchstart', move);

  closeBtn.addEventListener('mousedown', dragStart);
  closeBtn.addEventListener('touchstart', dragStart, passiveIfSupported);

  contentDiv = createEl('div', { id: 'my-app-content' });

  const footer = createEl('div', { id: 'my-app-footer' });
  footer.innerHTML = `v-${version}`;

  body.append(bodyInfo);
  body.append(contentDiv);
  mainDiv.append(body);
  mainDiv.append(footer);

  app.append(mainDiv);
  app.append(closeBtn);

  const style = createEl('style');
  style.innerHTML = styleText;

  document.body.append(style);
  document.body.append(app);

  // event listener
  app.addEventListener('click', contentClicked);
};

const reInit = () => {
  // cs.log(currentKey);
  if (window.__NUXT__.data && window.__NUXT__.data[currentKey]) {
    delete window.__NUXT__.data[currentKey];
  }
  // cs.log(window.__NUXT__.data);

  // Object.entries(window.__NUXT__.data).forEach((entry) => {
  //   const [key, obj] = entry;
  //   delete window.__NUXT__.data[key];
  // });

  currentKey = null;
  autoSearch = oldSearchString;
  oldSearchString = null;
  window.orfdl_initialized = false;
  init(false);
};

/**
 * init function
 * @return {void} nothing returned
 */
const init = async (createGui = true) => {
  if (window.orfdl_initialized) {
    return false;
  }
  window.orfdl_initialized = true;

  store = new Store();
  let ls = store.get(lsName);
  if (ls) {
    if ('undefined' !== typeof ls.search) {
      autoSearch = ls.search;
    }
    if ('undefined' !== typeof ls.open) {
      isOpen = ls.open;
    }
  }

  const host = window.location.host;
  dataObject = await createDataObject(host);
  // cs.log(dataObject);

  window.dataObject = dataObject;

  // early exit nothing found
  if (!dataObject || !dataObject.length) {
    return;
  }

  if (createGui) {
    createApp();
  }

  if (isOpen) {
    mainDiv.classList.add('open');
    mainDiv.style.display = 'block';
    closeBtn.classList.add('open');
  }

  const singleVideoPage = dataObject && dataObject.length === 2;
  if (singleVideoPage) {
    const filtered = dataObject.filter((el) => 'single' === el.type);
    renderSearchResults(filtered);
    return;
  }

  // if ('' !== autoSearch) {
  searchField.value = autoSearch;
  searchField.dispatchEvent(new Event('input'));
  searchNow(autoSearch);
  // }
  // else {
  // }
  searchField.focus();
};

setTimeout(init, 10);
