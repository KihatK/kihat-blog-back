const fs = require('fs');

const generatedSitemap = `
    User-agent: *
    Disallow: /newpost
    Disallow: /categorysetting
`;

fs.writeFileSync('../public/robots.txt', generatedSitemap, 'utf8');