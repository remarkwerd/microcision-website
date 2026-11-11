window.scrollTo(0,document.body.scrollHeight); await new Promise(r=>setTimeout(r,1500)); window.scrollTo(0,0);
const text=document.body.innerText;
const sha=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const o={url:location.href,title:document.title,desc:document.querySelector('meta[name=description]')?.content||null,og:document.querySelector('meta[property="og:image"]')?.content||null,robots:document.querySelector('meta[name=robots]')?.content||null,
imgs:[...document.querySelectorAll('img')].map(i=>(i.alt||'')+' | '+(i.currentSrc||i.src).split('/v1/')[0].replace('https://static.wixstatic.com/media/','')),
form:[...document.querySelectorAll('form input, form textarea, form select, form button')].map(e=>[e.tagName,e.type,e.name,e.placeholder,e.required,e.labels?.[0]?.innerText,e.getAttribute('aria-label')].join(' | ')),
iframes:[...document.querySelectorAll('iframe')].map(f=>f.src.slice(0,90)),
sha256:sha,text};
JSON.stringify(o).replace(/[\u007f-￿]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'))
