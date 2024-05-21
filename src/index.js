import css from './style.css?inline';
import {
  passiveIfSupported,
  createEl,
  Store,
  restrict,
  enableConsole,
} from '@/tools.js';
import pack from '../package.json'; // assert { type: 'json' };

const cs = enableConsole('cs');
// window.cs = cs;

const msg = {
  btn: 'Click on the image to copy the video-link to the clipboard',
};

const version = pack.version;
// let quality = 'Q8C';
let delivery = 'hls';

const styleText = css.toString(); //.replace(/\s+/g, ' ');
let to;

const orfOnCleanUp = (obj) => {
  obj.advertising_mapping = {};
  obj.advertising_query_string = '';
  obj.adition_advertising_query_string = '';
  obj.show_display_ads = false;
  obj.show_instream_ads = false;
  obj.youth_protection = undefined;
  obj.age_classification = undefined;
  obj.disable_display_ads_orf_platforms = true;
  obj.disable_instream_ads_orf_platforms = true;
};

const addLeadingZero = (string, max = 2) => ('0' + string).slice(-max);

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

const getPos = (evt) => {
  let t;
  if ('undefined' !== typeof evt.clientX) {
    t = evt;
  } else {
    t = evt.touches[0] || evt.changedTouches[0];
  }
  return {
    x: t.clientX,
    y: t.clientY,
  };
};

class OrfOn {
  constructor(option) {
    this.settings = Object.assign({}, OrfOn.defaults, option);
    this.name = 'dl-app';

    this.autoSearch = ''; // autoSearchString
    this.oldSearchString = null;
    this.dataObject = [];

    this.createWatcher();

    if (this.settings.createGui) {
      this.createApp();
    }
    this.store = new Store();

    this.init();
  }

  createWatcher() {
    // observer
    const canonical = document.querySelector('link[rel="canonical"]');
    const config = {
      attributes: true,
      subtree: true,
      attributeOldValue: true,
    };

    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes') {
          this.reInit();
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(canonical, config);
  }

  renderSearchResults = (results) => {
    this.contentDiv.innerHTML = '';
    // this.bodyInfo.style.display = results.length ? 'block' : 'none';
    if (!results.length) {
      return null;
    }

    const div = 'div';

    const fragment = new DocumentFragment();
    for (let i = results.length - 1; i >= 0; i--) {
      const obj = results[i];
      const result = createEl(div, { class: 'my-app-result' });
      const bar = createEl(div, { class: 'my-app-bar' });
      const title = createEl(div, { class: 'my-app-title' });
      title.innerHTML = obj.title;
      bar.append(title);

      const textArea = createEl(
        'textarea',
        { class: 'my-app-ta', disabled: 'true' },
        { position: 'absolute', left: '-999em', opacity: 0 }
      );
      const imgWrapper = createEl(div, {
        class: 'my-app-imgWrap',
        title: msg.btn,
      });
      const copyInfo = createEl(
        div,
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

    this.contentDiv.append(fragment);
  };

  contentClicked = (evt) => {
    const t = evt.target;
    if (this.currentActive) {
      this.currentActive.classList.remove('active');
      this.currentActive.querySelector('.my-app-copy').style.display = 'none';
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
        this.currentActive = parent;
      }
    } else if (
      'button' === t.nodeName.toLocaleLowerCase() &&
      'undefined' !== typeof t.dataset.share
    ) {
      shareButtonClicked(evt);
    }
  };

  dragStart = (evt) => {
    this.moved = false;
    document.body.classList.add('dragging');
    evt.stopPropagation();
    if ('touchstart' === evt.type) {
      this.closeBtn.removeEventListener('mousedown', this.dragStart);
      window.addEventListener('touchmove', this.drag, passiveIfSupported);
      window.addEventListener('touchend', this.dragEnd, false);
    } else if ('mousedown' === evt.type) {
      this.closeBtn.removeEventListener('touchstart', this.dragStart);
      window.addEventListener('mousemove', this.drag, false);
      window.addEventListener('mouseup', this.dragEnd, false);
    }
  };

  setPos({ x, y }) {
    x -= 19;
    y -= 19;

    x = restrict(x, 0, this.windowWidth - 38);
    y = restrict(y, 0, this.windowHeight - 38);

    this.closeBtn.style.left = x + 'px';
    this.closeBtn.style.top = y + 'px';
  }

  drag = (evt) => {
    evt.preventDefault();
    let pos = getPos(evt);
    this.moved = true;
    this.setPos(pos);
  };

  dragEnd = (evt) => {
    if ('touchend' === evt.type) {
      window.removeEventListener('touchmove', this.drag, passiveIfSupported);
      window.removeEventListener('touchend', this.dragEnd);
    } else if ('mouseup' === evt.type) {
      window.removeEventListener('mousemove', this.drag, false);
      window.removeEventListener('mouseup', this.dragEnd, false);
    }

    let { x, y } = getPos(evt);
    this.store.set(this.name, { posX: x, posY: y });
    document.body.classList.remove('dragging');
  };

  open = () => {
    this.mainDiv.style.display = 'block';
    to = setTimeout(() => {
      this.mainDiv.classList.add('open');
      this.closeBtn.classList.add('open');
      if (this.searchField) {
        this.searchField.focus();
      }
      this.isOpen = true;
      this.store.set(this.name, { open: this.isOpen });
      clearTimeout(to);
    }, 1);
  };

  close = () => {
    this.mainDiv.classList.remove('open');
    this.closeBtn.classList.remove('open');
    to = setTimeout(() => {
      this.mainDiv.style.display = 'none';
      this.isOpen = false;
      this.store.set(this.name, { open: this.isOpen });
      clearTimeout(to);
    }, 100);
  };

  toggle = () => {
    if (this.moved) {
      return false;
    }
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  orfOnFetchData = async () => {
    let count = 0;
    let to;
    return new Promise((resolve, reject) => {
      const get = () => {
        if (!window.__NUXT__) {
          reject();
        }
        count++;
        const tmp = window.__NUXT__.data;

        const data = Object.entries(tmp);
        let playerObject;

        // cs.log(count);

        data.forEach((entry) => {
          const [key, obj] = entry;

          // https://on.orf.at/video/14227160

          if (obj.sources && document.location.pathname.match(obj.id)) {
            playerObject = obj;
            orfOnCleanUp(obj);
            this.currentKey = key;
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

  clear = () => {
    this.searchField.value = '';
    this.searchField.dispatchEvent(new Event('input'));
    this.searchField.focus();
  };

  findData(inp) {
    if (!this.dataObject) {
      return null;
    }
    // no filtering, show all
    // if ('' === inp) {
    //   return this.dataObject;
    // }

    const type = '*' === inp ? 'all' : 'single';
    const filtered = this.dataObject.filter(
      (item) =>
        item.type === type &&
        ('*' === inp ||
          item.title
            .toLowerCase()
            .match(inp.replaceAll('*', '.*').toLowerCase()))
    );
    return filtered;
  }

  searchNow(searchString) {
    if (this.oldSearchString === searchString) {
      return;
    }
    // const searchData = '' === searchString ? [] : findData(searchString);
    const searchData = this.findData(searchString);
    // if (!searchData.length) {
    //   return;
    // }

    // todo: no update if nothing changed
    this.renderSearchResults(searchData);

    this.store.set(this.name, { search: searchString });
    this.oldSearchString = searchString;
  }

  onInput = (evt) => {
    const val = evt.currentTarget.value;
    this.searchNow(val);
    this.toggleClearBtn('' === val);
  };

  toggleClearBtn(hide) {
    if (hide) {
      this.clearBtn.style.display = 'none';
      this.clearBtnVisible = false;
      return;
    }
    if (!this.clearBtnVisible) {
      this.clearBtn.style.display = 'flex';
      this.clearBtnVisible = true;
    }
  }

  createOrfOn(playerObject) {
    window.playerObject = playerObject;
    const output = [];

    const createOne = (obj, type = 'single') => {
      orfOnCleanUp(obj);
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
        'undefined' !== typeof obj.is_drm_protected
          ? obj.is_drm_protected
          : null;

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
  }

  createDataObject = async () => {
    let playerObject;
    try {
      playerObject = await this.orfOnFetchData();
      // cs.log('playerObject', playerObject);
    } catch (error) {
      console.log(error);
      return false;
    }
    return this.createOrfOn(playerObject);
  };

  createApp() {
    const div = 'div';
    const app = createEl(div, { id: 'my-app' });
    const body = createEl(div, { id: 'my-app-body' });

    this.mainDiv = createEl(div, { id: 'my-app-box' }, { display: 'none' });

    // cs.log(this.mainDiv);
    // this.bodyInfo = createEl(div, { class: 'my-app-info' });
    // this.bodyInfo.innerHTML = msg.btn;

    this.header = createEl(div, { id: 'my-app-header' });
    this.showAllButton = createEl(div, { class: 'my-app-button' });
    this.showAllButton.innerHTML = 'Ganze Sendung anzeigen';

    this.showSegmentsButton = createEl(div, { class: 'my-app-button' });
    this.showSegmentsButton.innerHTML = 'Einzelne Beiträge anzeigen';

    this.buttons = createEl(div, { class: 'my-app-buttons' });

    this.buttons.append(this.showAllButton, this.showSegmentsButton);
    this.header.append(this.buttons);

    this.filterElement = createEl(div, { id: 'my-app-filter' });

    this.searchField = createEl('input', {
      type: 'text',
      id: 'my-app-field',
      name: 'fake_user[name]',
      value: '',
      autocomplete: 'new-password',
      spellcheck: 'false',
      'aria-autocomplete': 'none',
      placeholder: 'filter videos by name ...',
    });

    this.clearBtn = document.createElement(div);
    this.clearBtn.id = 'my-app-clear';
    this.clearBtn.innerHTML = 'X';
    this.toggleClearBtn(true);

    this.filterElement.append(this.searchField, this.clearBtn);
    this.header.append(this.filterElement);

    this.clearBtn.addEventListener('click', this.clear, false);
    this.searchField.addEventListener('input', this.onInput, false);
    this.mainDiv.append(this.header);

    this.closeBtn = createEl(div, { id: 'my-app-close' });

    this.closeBtn.addEventListener('click', this.toggle);

    window.addEventListener('resize', this.resize);
    this.resize();

    this.closeBtn.addEventListener('mousedown', this.dragStart);
    this.closeBtn.addEventListener(
      'touchstart',
      this.dragStart,
      passiveIfSupported
    );

    this.contentDiv = createEl(div, { id: 'my-app-content' });

    const footer = createEl(div, { id: 'my-app-footer' });
    footer.innerHTML = `v-${version}`;

    body.append(this.contentDiv);
    this.mainDiv.append(body, footer);

    app.append(this.mainDiv, this.closeBtn);
    const style = createEl('style');
    style.innerHTML = styleText;

    document.body.append(style);
    document.body.append(app);

    // event listener
    app.addEventListener('click', this.contentClicked);

    this.showAllButton.addEventListener('click', this.showAll);
    this.showSegmentsButton.addEventListener('click', this.showSegments);
    this.app = app;
  }

  setActiveTab(tabName) {
    this.store.set(this.name, { activeTab: tabName });
    this.activeTab = tabName;
  }

  showAll = () => {
    if ('1' === this.activeTab) {
      return false;
    }
    // cs.log('showAll');
    this.showAllButton.classList.add('active');
    this.showSegmentsButton.classList.remove('active');
    const searchData = this.findData('*');
    this.filterElement.classList.add('hidden');
    this.renderSearchResults(searchData);
    this.setActiveTab(1);
  };

  showSegments = () => {
    if ('2' === this.activeTab) {
      return false;
    }
    this.showAllButton.classList.remove('active');
    this.showSegmentsButton.classList.add('active');
    this.filterElement.classList.remove('hidden');
    let search = this.oldSearchString || this.searchField.value;
    // cs.log('search', search);
    this.toggleClearBtn(!search);
    this.searchField.focus();

    this.oldSearchString = null;
    this.searchNow(search);
    this.setActiveTab(2);
  };

  resize = () => {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  };

  reInit = () => {
    // cs.log('reInit');
    this.currentKey = null;
    this.autoSearch = this.oldSearchString;
    this.oldSearchString = null;
    this.contentDiv.innerHTML = '';
    this.start();
  };

  start = async () => {
    this.dataObject = await this.createDataObject();
    // early exit nothing found
    if (!this.dataObject || !this.dataObject.length) {
      return;
    }

    const singleVideoPage = this.dataObject && this.dataObject.length === 2;

    if (singleVideoPage) {
      this.header.classList.add('hidden');
      const filtered = this.dataObject.filter((el) => 'single' === el.type);
      this.renderSearchResults(filtered);
    } else {
      this.header.classList.remove('hidden');
      this.searchField.value = this.autoSearch;

      cs.log('activeTab', this.activeTab);

      if (1 === this.activeTab) {
        this.showAll();
      } else if (2 === this.activeTab) {
        this.showSegments();
        // this.searchField.dispatchEvent(new Event('input'));
        // this.searchField.focus();
        // cs.log(this.autoSearch);
        // this.searchNow(this.autoSearch);
      }
    }
  };

  init() {
    // cs.log('init');
    let ls = this.store.get(this.name);
    this.activeTab = 1;
    if (ls) {
      if ('undefined' !== typeof ls.search) {
        this.autoSearch = ls.search;
      }
      if ('undefined' !== typeof ls.open) {
        this.isOpen = ls.open;
      }
      if ('undefined' !== typeof ls.posX && 'undefined' !== typeof ls.posY) {
        this.setPos({ x: ls.posX, y: ls.posY });
      }
      if ('undefined' !== typeof ls.activeTab) {
        this.activeTab = +ls.activeTab;
      }
    }

    cs.log(ls);
    cs.log(this.activeTab);

    this.start();

    if (this.isOpen) {
      this.mainDiv.classList.add('open');
      this.mainDiv.style.display = 'block';
      this.closeBtn.classList.add('open');
    }
  }
}

OrfOn.defaults = {
  createGui: true,
};

/**
 * init function
 * @return {void} nothing returned
 */
const init = () => {
  if (window.orfdl_initialized) {
    return false;
  }
  window.orfdl_initialized = true;
  new OrfOn();
};

let inter = setInterval(() => {
  init();
  // cs.log('ssss');
  if (window.orfdl_initialized) {
    clearInterval(inter);
  }
}, 10);

// setTimeout(init, 10);

export default init;
