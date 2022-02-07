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