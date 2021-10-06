module.exports = {
	plugins: ['@vuepress/active-header-links', {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
          },
          '@vuepress/medium-zoom', {
            selector: 'img.zoom-custom-imgs',
            // medium-zoom options here
            // See: https://github.com/francoischalifour/medium-zoom#options
            options: {
            margin: 16
            }
          },
          '@vuepress/back-to-top'
        ]
}

