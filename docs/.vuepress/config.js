module.exports = {
    title: '解小魔',
    description: '请用绝对清醒和理智压制你不该有的情绪',
    dest: './dist',
    port: '8080',
    head: [
        ['link', {rel: 'icon', href: '/img/logo.jpg'}]
    ],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [
		 { text: '首页', link: '/' },    
		 { text: '指南', link: '/java/' },   
		 { text: '文章', link: '/Docker学习笔记.md'}
		 ],
        sidebar: {'/java/':[
            {
                  title:'新手指南',
                  collapsable: true,
                  children:[
                    '/java/notes/one',
                  ]
                },
                {
                  title:'java',
                  collapsable: true,
                  children:[
                    '/java/notes/two',
                  ]
                }
            ]
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        searchMaxSuggestoins: 10,
        serviceWorker: {
            updatePopup: {
                message: "有新的内容.",
                buttonText: '更新'
            }
        },
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页 ！'
    },
	plugins: [
            require('./plugin.js')
        ]
}

