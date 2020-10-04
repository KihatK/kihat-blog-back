const fs = require('fs');
const fetch = require('node-fetch');
const prettier = require('prettier');

const getDate = new Date().toISOString();

const fetchUrl = 'https://kihat.ga/api/posts/all';
const MY_DOMAIN = 'https://kihat.ga';

const formatted = sitemap => prettier.format(sitemap, { parser: 'html' });

(async () => {
    const fetchPosts = await fetch(fetchUrl)
        .then(res => res.json())
        .catch(err => console.log(err));
    
    const postList = [];
    fetchPosts.forEach(post => postList.push(post.uuid));

    const postListSitemap = `
        ${postList.map(uuid => {
            return `
                <url>
                    <loc>${`${MY_DOMAIN}/post/${uuid}`}</loc>
                    <lastmod>${getDate}</lastmod>
                </url>
            `;
        }).join('')}
    `;

    const generateSitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        >
            ${postListSitemap}
        </urlset>
    `;

    const formattedSitemap = [formatted(generateSitemap)];

    fs.writeFileSync('../public/sitemap/sitemap-posts.xml', formattedSitemap, 'utf8');
})();