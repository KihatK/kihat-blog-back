const fs = require('fs');
const fetch = require('node-fetch');
const prettier = require('prettier');

const getDate = new Date().toISOString();

const fetchUrl = 'https://kihat.ga/api/scategory';
const MY_DOMAIN = 'https://kihat.ga';

const formatted = sitemap => prettier.format(sitemap, { parser: 'html' });

(async () => {
    const fetchCategories = await fetch(fetchUrl)
        .then(res => res.json())
        .catch(err => console.log(err));
    
    const categoryList = [];
    fetchCategories.forEach(category => categoryList.push(category.name));

    const categoryListSitemap = `
        ${categoryList.map(category => {
            return `
                <url>
                    <loc>${`${MY_DOMAIN}/category/${category}`}</loc>
                    <lastmod>${getDate}</lastmod>
                </url>
            `;
        }).join('')}
    `;

    const generatedSitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        >
            ${categoryListSitemap}
        </urlset>
    `;

    const formattedSitemap = [formatted(generatedSitemap)];

    fs.writeFileSync('../public/sitemap/sitemap-category.xml', formattedSitemap, 'utf8');
})();