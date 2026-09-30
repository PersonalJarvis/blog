<?xml version="1.0" encoding="UTF-8"?>
<!-- Renders the RSS feed as a readable page when opened in a browser.
     Feed readers ignore this and read the XML as usual. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/rss/channel">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RSS feed · <xsl:value-of select="title" /></title>
        <link rel="icon" type="image/svg+xml" href="/blog/gigi.svg" />
        <style>
          :root { color-scheme: light; --paper: #fbfaf7; --panel: #f3f1eb; --ink: #171613; --ink-2: #44423c; --ink-3: #6f6c64; --rule: #e2dfd6; --accent: #9a6412; }
          @media (prefers-color-scheme: dark) {
            :root { color-scheme: dark; --paper: #131311; --panel: #1b1a17; --ink: #f2f0e9; --ink-2: #cdc9bf; --ink-3: #9c988d; --rule: #2a2925; --accent: #e3ad4f; }
          }
          * { box-sizing: border-box; }
          body { margin: 0; background: var(--paper); color: var(--ink); font-family: Georgia, "Times New Roman", serif; line-height: 1.6; }
          .wrap { max-width: 44rem; margin: 0 auto; padding: 4rem 1.25rem 5rem; }
          .small { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; font-size: 0.875rem; color: var(--ink-3); }
          .brand { display: flex; align-items: center; gap: 0.6rem; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; font-weight: 600; color: var(--ink); text-decoration: none; }
          h1 { margin: 2.5rem 0 0; font-weight: 500; font-size: clamp(2rem, 6vw, 2.75rem); line-height: 1.1; letter-spacing: -0.02em; }
          .lead { margin: 1rem 0 0; color: var(--ink-2); font-size: 1.15rem; }
          .box { margin-top: 2rem; padding: 1.1rem 1.25rem; border-radius: 8px; background: var(--panel); }
          .box p { margin: 0 0 0.6rem; }
          .url { display: flex; gap: 0.5rem; flex-wrap: wrap; }
          code { flex: 1 1 16rem; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.875rem; padding: 0.5rem 0.65rem; border-radius: 6px; border: 1px solid var(--rule); background: var(--paper); color: var(--ink); overflow-wrap: anywhere; }
          button { font: inherit; padding: 0.5rem 0.9rem; border: 0; border-radius: 6px; background: var(--ink); color: var(--paper); cursor: pointer; }
          ol { list-style: none; margin: 3rem 0 0; padding: 0; border-top: 1px solid var(--ink); }
          li { padding: 1.4rem 0; border-bottom: 1px solid var(--rule); }
          li a { color: var(--ink); text-decoration: none; font-size: 1.35rem; line-height: 1.25; }
          li a:hover { text-decoration: underline; text-underline-offset: 0.18em; }
          li p { margin: 0.4rem 0 0; color: var(--ink-2); }
          .back { color: var(--accent); }
        </style>
      </head>
      <body>
        <main class="wrap">
          <a class="brand" href="/blog/"><img src="/blog/gigi.svg" alt="" width="26" height="28" />Personal Jarvis <span class="small">Blog</span></a>
          <h1>Subscribe to the blog</h1>
          <p class="lead">This is the RSS feed of <xsl:value-of select="title" />. Add its address to any feed reader and new posts arrive there as they are published.</p>
          <div class="box small">
            <p>Feed address</p>
            <div class="url">
              <code id="feed">https://personaljarvis.ai/blog/rss.xml</code>
              <button type="button" onclick="navigator.clipboard.writeText(document.getElementById('feed').textContent).then(function(){{ this.textContent = 'Copied'; }}.bind(this))">Copy</button>
            </div>
          </div>
          <ol>
            <xsl:for-each select="item">
              <li>
                <div class="small"><xsl:value-of select="substring(pubDate, 6, 11)" /></div>
                <a href="{link}"><xsl:value-of select="title" /></a>
                <p><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ol>
          <p class="small"><a class="back" href="/blog/">Back to the blog</a></p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
