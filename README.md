# RevEye: Reverse image search extension for Google Chrome

[![GitHub license](https://img.shields.io/github/license/steven2358/reveye)](https://github.com/steven2358/reveye/blob/master/LICENSE.txt)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/steven2358/reveye)

This extension allows to perform an inverse image search by right-clicking onto any image in a web site.

The context menu can be configured to contain either a single button with the default search engine, or a cascaded menu with all included search engines.


## Install

Stable version: Go to the [Google Chrome Web Store](https://chrome.google.com/webstore/detail/keaaclcjhehbbapnphnmpiklalfhelgf) and click "Add to Chrome".

Development version: [Download the source from GitHub](https://github.com/steven2358/reveye/archive/master.zip) and [load the extension into Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked).


## Changes

- v1.5.2 (2022-11-13): Replaced Google Image Search by Google Lens.
- v1.5.1 (2021-01-19): Fixed a bug in upgrade/initialization script.
- v1.5.0 (2021-01-18): Add checkboxes to enable/disable individual search engines. Removed Baidu (for now).
- v1.4.8 (2020-11-24): Fixed Yandex search.
- v1.4.7 (2019-06-14): Removed unnecessary permissions.
- v1.4.6 (2019-06-14): Fixed Yandex search.
- v1.4.5 (2017-07-23): Fixed Baidu search.
- v1.4.4 (2015-05-20): Re-included Yandex and Baidu search.
- v1.4.3 (2015-05-19): Included Bing image match.
- v1.4 (2013-06-28): Performed security changes and updated manifest to v2. Removed Yandex, Baidu, Cydral.  
- v1.3 (2011-06-17): Included Google (brand new and kicking), Yandex and Baidu image search engines. Removed GazoPa as they discontinued their B2C service.  
- v1.2 (2011-05-30): Name change to comply with Google's branding policies. Added Cydral search engine. Added option to choose between default engine or cascaded submenu.  
- v1.1 (2011-03-01): Added option to select between TinEye and GazoPa search engines.  
- v1.0 (2010-03-02): Added context menu.  
- v0.2 (2009-12-14): Included new logo.  
- v0.1 (2009-12-13): Initial version. Performs reverse image search of all images on a page using TinEye.  


## Philosophy

RevEye is free and open source software. To minimize its memory footprint in your browser, it is written in pure vanilla JavaScript and it does not use any of the fancy JavaScript frameworks.

RevEye does not track any of your data, and it does not include ads. If you want to support RevEye development you can make a donation through [PayPal](https://www.paypal.com/donate/?business=ZUV4WDZHM6N6S&no_recurring=0&currency_code=EUR), Bitcoin (12358FQL4NuQGrU3vFcUBDBk988iQEUBd3) or [Brave tips](https://brave.com/tips/).


## Author

Copyright (c) 2010-2022 Steven Van Vaerenbergh


## License

Released under the GPLv3 license. For full details see the LICENSE.txt file included in this distribution.
