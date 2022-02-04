
![image](https://user-images.githubusercontent.com/6468571/152601370-fd51c475-8f32-46a4-83d2-44f77cecd376.png)

# The Vanilla Dashboard Project

🍦 The Vanilla Dashboard is a Vanilla JavaScript dashboard that connects to a.txt file-based database through PHP.
Vanilla Dashboard is free and open source software.

The Vanilla Dashboard is a free and open-source project, and comes with Vanilla, "Live Chat," and "Who Is Online"
services baked in, as well as a variety of "Easter Eggs," all wrapped up in a Vanilla CSS UI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/donPabloNow/Vanilla-Dashboard) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy/?template=https://gitpod.io/#https://github.com/donPabloNow/Vanilla-Dashboard) [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/donPabloNow/Vanilla-Dashboard) [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/donPabloNow/Vanilla-Dashboard) 

## Content Index

- [Road Map](#Road-Map)
- [Installation](#Installation-Instructions)
- [Usage & How to Guide](#Usage-&-How-to-Guide)
- [Contributing to the Project](#Contributing-to-the-Project)
- [Licensing and Ownership](#Licensing-and-Ownership)
![image](https://user-images.githubusercontent.com/6468571/152601481-d3792aa4-7f82-4bc5-9b8d-1ad77f66faf5.png)
## Road Map

- [x] Foundation
    - [x] API Service
    - [x] TxT DB
    - [x] Login
    - [x] Registration
    - [x] Dashboard
    - [x] Who is Online
    - [x] Documentation
- [ ] Tables
    - [x] Users
    - [x] Notes
    - [x] Tasks
    - [ ] Chat
- [ ] Notes
    - [x] Data Scheme
    - [x] API Endpoints
    - [x] Functions
    - [ ] UI
- [ ] Tasks
    - [x] Data Scheme
    - [x] API Endpoints
    - [x] Functions
    - [ ] UI
- [ ] Chat
    - [ ] Data Scheme
    - [x] API Endpoints
    - [x] Functions
    - [ ] UI
- [ ] Testing
    - [x] Versions
    - [x] Owners
    - [ ] Crate details

![image](https://user-images.githubusercontent.com/6468571/152181888-0b505d28-41c9-4d17-bf4d-9cb3b3411e67.png)

![image](https://user-images.githubusercontent.com/6468571/152180986-20e0beb1-c098-421b-b71a-e8cfc01aa170.png)

## Installation Instructions

# Lando

You may either "plug and play" on PHP-compatible machines or build in a LAMP environment using the project's LAMP recipe
for Lando - A Liberating Dev Tool For All Your Projects, which can be found here. If you want to learn more about the
project, check out the FAQ. The use of local development and DevOps technologies by professional developers is
widespread around the globe, while it is most prominent in the United States. Release oneself from the mental
restrictions imposed by inadequate software for development. You may be able to save time, money, and frustration if you
concentrate your efforts on the most important tasks.

![image](https://user-images.githubusercontent.com/6468571/152177774-25482b2a-f8cd-4f19-a221-97dc29212a2d.png)

```
# Start it up
lando start

# List information about this app.
lando info
```

or

```
# Initialize a lamp recipe using the latest codeigniter version
lando init \
  --source remote \
  --remote-url https://github.com/bcit-ci/CodeIgniter/archive/3.1.10.tar.gz \
  --remote-options="--strip-components 1" \
  --recipe lamp \
  --webroot . \
  --name my-first-lamp-app
```

For more information please see: https://docs.lando.dev/config/lamp.html

![image](https://user-images.githubusercontent.com/6468571/152178164-3cf9d286-6ca2-407e-8f62-50fc4d217a6b.png)

![image](https://user-images.githubusercontent.com/6468571/152181962-33e4e658-5fbc-4b2d-9366-7147e9fabe65.png)

# Gitpod

Gitpod is an open-source Kubernetes tool for quickly establishing code-ready development environments. It produces
fresh, automated development environments in the cloud for each work utilising cloud-based technologies. And it does all
of this in the cloud. It enables you to declare your development environment in code, as well as to launch immediate,
remote, and cloud-based development environments directly from your browser or desktop integrated development
environment.

https://gitpod.com/#https://github.com/donPabloNow/vanilla-dashboard

![image](https://user-images.githubusercontent.com/6468571/152177615-421c1286-33cd-4c38-9f7b-3c486901ba81.png)

![image](https://user-images.githubusercontent.com/6468571/152181058-6446dd76-3012-4e9f-b05a-7d86ca5d0872.png)

## Usage & How to Guide

Navigate to the root of the project with your browser, register an account and then login.

![image](https://user-images.githubusercontent.com/6468571/152178601-981f8e64-a22e-4278-89dd-46e2c39ee77f.png)

![image](https://user-images.githubusercontent.com/6468571/152181949-99b9aaa6-586e-4f64-826d-ec7616535d1c.png)

![image](https://user-images.githubusercontent.com/6468571/152181096-2b8db6ac-337c-48be-849b-4bca24e4a39b.png)

## Contributing to the Project

Pull requests are evaluated and approved by the development team. If you want to talk about the changes you want to
make, please create a new issue for that purpose. If possible, please ensure that tests are updated on a regular basis
in order to avoid misconceptions.

![image](https://user-images.githubusercontent.com/6468571/152181932-88f8e56c-b479-478a-8e38-06150cf4ef3e.png)

![image](https://user-images.githubusercontent.com/6468571/152178640-266dfe32-62c2-4ad2-a2c9-2096af248e18.png)

![image](https://user-images.githubusercontent.com/6468571/152181962-33e4e658-5fbc-4b2d-9366-7147e9fabe65.png)

![image](https://user-images.githubusercontent.com/6468571/152181124-d8d43105-8525-4220-ab91-a4caf933634b.png)

## Power Up

```

node index.js

```

- URL address `http://127.0.0.1:8000/` (default, can be changed in config)
- __first start__ you have to install components via Component manager in `Dashboard`


```javascript
var options = {};

// ====================================
// COMMON (OPTIONAL)
// ====================================

// options.url = '/$dashboard/';

// A maximum length of request:
// options.limit = 50;

// Predefined set of components (default value):
// options.templates = 'https://raw.githubusercontent.com/totaljs/dashboardcomponents/master/templates.json';

// ====================================
// Security (OPTIONAL)
// ====================================

// +v6.0.0
// Default light theme
// options.dark = false;

// +v6.0.0
// Enables backing up of Dashboard designer
// options.backup = true;
// default: false

// +v6.0.0
// Enables link to Flow (if exists) in context menu
// options.flow = true;
// default: true

// +v6.0.0
// Enables link to Flowboard (if exists) in context menu
// options.flowboard = true;
// default: true

// HTTP Basic auth:
// options.auth = ['admin:admin', 'name:password'];

// Standard "authorize" flag
// options.auth = true;

// IP restrictions:
// options.restrictions = ['127.0.0.1', '138.201', '172.31.33'];

// options.token = ['OUR_COMPANY_TOKEN'];
// you can open dashboard using : /$dashboard/?token=OUR_COMPANY_TOKEN

INSTALL('package', 'https://cdn.totaljs.com/dashboard.package', options);
```

## How to create own component?

### Dashboard (client-side)

```html
<!-- (OPTIONAL) SETTINGS FORM -->
<script type="text/html" settings>
<div class="padding npb">
    <div class="m" data-jc="dropdown" data-jc-path="id" data-required="true" data-source="common.instances" data-source-condition="n => n.component === 'dashboardanalytics'" data-empty="">@(Flow instance)</div>
</div>
</script>

<!-- (OPTIONAL) ELEMENT IN DESIGNER -->
<script type="text/html" body>
    <div class="click"><i class="fa fa-plug"></i></div>
</script>

<!-- (OPTIONAL) CUSTOM STYLES -->
<style>
    .fb-component { background-color: #E33733; color: white; text-align: center; font-size: 16px; }
</style>

<!-- (OPTIONAL) CODE -->
<script>
// {String}, IMPORTANT (lower case without diacritics)
exports.name = 'component';

// {String}, optional (default: "component name")
exports.title = 'Component';

// {String}, optional (default: "")
// Font-Awesome icon without "fa-"
exports.icon = 'plug';

// {String}, optional (default: "Unknown")
exports.author = 'Peter Širka';

// {String}, optional (default: "Common")
exports.group = 'Common';

// {Object}, optional (default "undefined")
// Default options for new and existing instances
exports.options = { id: null };

// {String}, optional (default: "")
exports.version = '1.0.0';

// Installation
exports.install = function(instance) {

    // =======================================
    // PROPERTIES
    // =======================================

    instance.id;
    // {String} current instance ID

    instance.element;
    // {jQuery Element} current element

    instance.name;
    // {String} component name

    instance.size;
    // {Object} current size of element

    instance.options;
    // {Object} custom options

    // =======================================
    // METHODS
    // =======================================

    instance.emit(name, [argA], [argN]);
    // Emits an event for this component

    instance.on(name, fn);
    // Registers a listener for the event

    instance.menu(items, [element], [callback(item)], [offsetX]);
    // Shows a context-menu
    // items [{ name: String, icon: String }, { name: String, icon: String, url: String }, 'DIVIDER']

    instance.send(id, type, [data]);
    // Sends a message to specified instance by instance id

    instance.find(selector);
    // Returns jQuery (alias for instance.element.find())

    instance.append(html);
    // Appends HTML (alias for instance.element.append())

    instance.html(html);
    // Rewrites content (alias for instance.element.html())

    instance.event(html);
    // Registers a listener for the event (alias for instance.element.on())

    instance.settings();
    // Shows settings form

    instance.hidden();
    // Determines whether the widget is hidden
    // Returns {Boolean}

    instance.transparent([true]);
    // if true passed in then widget-body background-color is set to be transparent
    // and removes box-shadow

    // =======================================
    // EVENTS
    // =======================================

    instance.on('destroy', function() {
        // instance is destroying
    });

    instance.on('options', function(options_new, options_old) {
        // options were changed
    });

    instance.on('resize', function(size) {
        // size.width    {Number}
        // size.height   {Number}
        // size.device   {String}: lg, md, sm, xs
        // size.cols     {Number}
        // size.rows     {Number}
    });

    instance.on('lg', function(size) {
        // Is a large display
    });

    instance.on('md', function(size) {
        // Is a medium display
    });

    instance.on('sm', function(size) {
        // Is a small display
    });

    instance.on('xs', function(size) {
        // Is an extra small display
    });

    instance.on('data', function(response) {

        response.id;
        // {String} Flow: instance.id

        response.name;
        // {String} Flow: instance.name

        response.component;
        // {String} Flow: instance.component

        response.reference;
        // {String} Flow: instance.reference

        response.type;
        // {String} type (optional)

        response.body;
        // {Object} data

    });
};

// (OPTIONAL) Uninstallation
exports.uninstall = function() {
    // This method is executed when the component is uninstalled from the Dashboard
};
</script>
```

__Common variables (client-side)__:

```javascript
common.instances;
// {Object Array} All Flow instances

DEBUG;
// {Boolean} Determines component's maker

RELEASE;
// {Boolean} Determines dashboard

Icons;
// {Object} Contains Font-Awesome UTF-8 chars for SVG images
// +v6.0.0
```

__Common methods (client-side)__:

```javascript
common.operations.emit(event_name, [arg1], [arg2], [argN]);
// Emits an event in all components
```

__Good to know__:

- each Dashboard element is wrapped to `data-jc-scope=""` (generated randomly)

### Flow (server-side)

Each Flow component connected to Dashboard component can define this code:

```javascript
// (Optional) This method sends data to Dashboard component (server-side to client-side)
instance.dashboard(type, data);

// (Optional) This event captures data from Dashboard component
instance.on('dashboard', function(type, data) {

});
```

## Client-Side

### Events

```javascript
ON('open.componentname', function(component, options) {
    // Settings will be open
});

ON('save.componentname', function(component, options) {
    // Settings will be save
});

ON('apply', function() {
    // Designer will be sent to server
});
```

### Components: jComponent +v14.5.0

Bellow jComponents can be used in `Settings form`:

- autocomplete (declared `body`)
- binder (declared in `body`)
- calendar (declared in `body`)
- checkbox
- checkboxlist
- codemirror
- colorpicker (declared in `body`)
- confirm (declared in `body`)
- contextmenu (declared in `body`)
- dropdown
- dropdowncheckbox
- error
- exec (declared in `body`)
- form
- importer
- keyvalue
- loading
- message (declared in `body`)
- nosqlcounter
- repeater
- repeater-group
- search
- selectbox
- textbox
- textboxlist
- validation
- visible
- multioptions
- dragdropfiles
- filereader

__References:__

- [Componentator.com](https://componentator.com/)
- [jComponents on Github](https://github.com/totaljs/jComponent)

## Components

- https://github.com/totaljs/dashboardcomponents

## Licensing and Ownership

[MIT](https://choosealicense.com/licenses/mit/)

![image](https://user-images.githubusercontent.com/6468571/152601521-14070390-49c9-48eb-b35e-4a0372b3b416.png)

