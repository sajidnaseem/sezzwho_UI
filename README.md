 Sezzwho Building Mobile Cordova Web Apps
=====================================================================

Copyright © 2012-2015, Intel Corporation. All rights reserved.

See [LICENSE.md](<LICENSE.md>) for license terms and conditions.


The `cordova.js` script is needed to provide your app with access to Cordova
APIs. To add Cordova APIs to your application you must add the corresponding
Cordova plugins. See the *Plugins* section on the **Projects** tab.

**IMPORTANT:** the `intelxdk.js` and `xhr.js` script files are not automatically
included in this template, as they have been in past versions. Those files are
only needed for apps built using the legacy AppMobi build containers on the
**Build** tab, which have been deprecated. We encourage you to use the Cordova
containers for all new applications. These script files can be added by hand, if
you require them, as follows:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<script src="intelxdk.js"></script>
<script src="cordova.js"></script>
<script src="xhr.js"></script>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


