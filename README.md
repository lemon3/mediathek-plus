<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]


[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/lemon3/orfdl">
    <img src="https://raw.githubusercontent.com/lemon3/orfdl/main/_assets/dl.svg" alt="Logo" width="140" height="auto">
  </a>
  <h3 align="center">orf tvthek video download helper</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

A small helper to get the link for a given video from the orf tvtheke.
Usefull to download videos on the run (mobile device).

(btw.: this script doesn't download files, it's just a helper for fetching links).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage
### What's needed?
A so call userscript handler is needed.
There is one for each browser available, you can decide between tampermonkey, greasemonkey, violentmonkey, userscripts, ...

#### example (iOS, mobile Safari)
you need to extend safari ([what are extension?](https://support.apple.com/en-gb/guide/iphone/iphab0432bf6/ios)).
**step-by-step guide:**
1) download [userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) extension form the App Store.
2) in the userscripts app set the location, where you would like to store your userscripts.
3) now download this [script](https://github.com/lemon3/orfdl/blob/main/dist/orfdl.user.js) and save it to your recently defined userscripts directory.
4) download [a-shell-mini](https://apps.apple.com/at/app/a-shell-mini/id1543537943) or [a-shell](https://apps.apple.com/at/app/a-shell/id1473805438) (this app is needed to download the videos).
5) go to the **orf tvtheke** and look for a video. An additional menu will appear at the top left, with the help of which you can copy the video link to the clipboard or filter the videos if the show/broadcast has multiple files/segments.
6) just paste this video-link into „a-shell“ or „a-shell mini“, and the file will be downloaded.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact
Wolfgang Jungmayer - lemon3.at

Project Link: [https://github.com/lemon3/orfdl](https://github.com/lemon3/orfdl)
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<div align="center">coded with ❤ in vienna</div>


<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/lemon3/birthdaypicker?style=for-the-badge
[license-url]: https://raw.githubusercontent.com/lemon3/orfdl/main/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/wolfgangjungmayer/
