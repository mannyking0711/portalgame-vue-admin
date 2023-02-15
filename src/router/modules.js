export const routers = [{
        path: '/',
        name: 'index',
        title: 'crm.Sidebar.HomePage',
        icon: 'icon-home',
        permission: 'accept',
        sidebar: true,
        component: () =>
            import ('../views/home/HomeIndex'),
    },
    {
        path: '*',
        title: 'crm.Sidebar.GameMenu',
        icon: 'icon-gamepad',
        permission: ['game_status.read', 'game_level.read', 'game_language.read', 'game.read', 'squid_game.read'],
        sidebar: true,
        children: [{
                path: '/squid-games',
                name: 'squid-games',
                title: 'Squid Games',
                icon: 'icon-layers1',
                permission: 'squid_game.read',
                sidebar: true,
                component: () =>
                    import ('../views/squid-game/SquidGameIndex'),
            },
            {
                path: '/game-status',
                name: 'game-status',
                title: 'crm.Sidebar.GameStatuses',
                icon: 'icon-layers1',
                permission: 'game_status.read',
                sidebar: true,
                component: () =>
                    import ('../views/game-status/GameStatusIndex'),
            },
            {
                path: '/game-level',
                name: 'game-level',
                title: 'crm.Sidebar.GameLevels',
                icon: 'icon-server',
                permission: 'game_level.read',
                sidebar: true,
                component: () =>
                    import ('../views/game-level/GameLevelIndex'),
            },
            {
                path: '/game-language',
                name: 'game-language',
                title: 'crm.Sidebar.GameLanguages',
                icon: 'icon-language',
                permission: 'game_language.read',
                sidebar: true,
                component: () =>
                    import ('../views/game-language/GameLanguageIndex'),
            },
            {
                path: '/game-categories',
                name: 'game-categories',
                title: 'crm.Sidebar.GameCategories',
                icon: 'icon-th',
                permission: 'game_categories.read',
                sidebar: true,
                component: () =>
                    import ('../views/game-categories/GameCategoriesIndex'),
            },
            {
                path: '/game',
                name: 'game',
                title: 'crm.Sidebar.Games',
                icon: 'icon-gamepad',
                permission: 'game.read',
                sidebar: true,
                component: () =>
                    import ('../views/game/GameIndex'),
            },
            {
                path: '/comments',
                name: 'comments',
                title: 'crm.Sidebar.Comments',
                icon: 'icon-comment',
                permission: 'game.read',
                sidebar: true,
                component: () =>
                    import ('../views/comments/CommentsIndex'),
            },
        ]
    },

    {
        path: '*',
        title: 'crm.Sidebar.EmployeeMenu',
        icon: 'icon-user',
        permission: ['employee_type.read', 'employee.read'],
        sidebar: true,
        children: [{
                path: '/employee-type',
                name: 'employee-type',
                title: 'crm.Sidebar.EmployeeTypes',
                icon: 'icon-grid',
                permission: 'employee_type.read',
                sidebar: true,
                component: () =>
                    import ('../views/employee-type/EmployeeTypeIndex'),
            },
            {
                path: '/employee',
                name: 'employee',
                title: 'crm.Sidebar.Employees',
                icon: 'icon-users',
                permission: 'employee.read',
                sidebar: true,
                component: () =>
                    import ('../views/employee/EmployeeIndex'),
            },
            {
                path: '/employee-bonus',
                name: 'employee-bonus',
                title: 'crm.Sidebar.EmployeesBonus',
                icon: 'icon-users',
                permission: 'employee_bonus.read',
                sidebar: true,
                component: () =>
                    import ('../views/employee/EmployeeBonus'),
            },
            {
                path: '/employee-bonus-type',
                name: 'employee-bonus-type',
                title: 'crm.Sidebar.EmployeesBonusType',
                icon: 'icon-users',
                permission: 'employee_bonus.read',
                sidebar: true,
                component: () =>
                    import ('../views/employee/EmployeeBonusType'),
            },
            {
                path: '/staff',
                name: 'staff',
                title: 'crm.Sidebar.Staff',
                icon: 'icon-users',
                permission: 'staff.read',
                sidebar: true,
                component: () =>
                    import ('../views/employee/StaffIndex'),
            },
        ]
    },
    {
        path: '*',
        title: 'Squid Character Test',
        icon: 'icon-gamepad',
        permission: 'squid_questions.read',
        sidebar: true,
        children: [{
                path: '/squid-question',
                name: 'squidquestion',
                title: 'Squid Game Questions',
                icon: 'icon-question-circle-o',
                permission: 'squid_questions.read',
                sidebar: true,
                component: () =>
                    import ('../views/squid-game/SquidGameQuestions'),
            },
            {
                path: '/squid-characters',
                name: 'squidcharacters',
                title: 'Squid Game Characters',
                icon: 'icon-user',
                permission: 'squid_characters.read',
                sidebar: true,
                component: () =>
                    import ('../views/squid-game/SquidGameCharacters'),
            },
        ]
    },
    {
        path: '/customer',
        name: 'customer',
        title: 'crm.Sidebar.Customers',
        icon: 'icon-users',
        permission: 'customer.read',
        sidebar: true,
        component: () =>
            import ('../views/customer/CustomerIndex'),
        children: [{
            path: '/customer-info/:id',
            name: 'customer_info',
            icon: 'icon-users',
            permission: 'customer.read',
            sidebar: false,
            key: 'path',
            component: () =>
                import ('../views/customer/CustomerInfo'),
        }]
    },
    {
        path: '*',
        title: 'Ləvazımatlar',
        icon: 'icon-shopping-bag',
        permission: 'product_inventory.read',
        sidebar: true,
        children: [{
                path: '/products-inventory',
                name: 'productsInventory',
                title: 'Ləvazımatlar inventarı',
                icon: 'icon-shopping-bag',
                permission: 'product_inventory.read',
                sidebar: true,
                component: () =>
                    import ('../views/products-inventory/ProductsInventoryIndex'),
            },
            {
                path: '/products-category',
                name: 'productsCategory',
                title: 'Ləvazımatlar kateqoryası',
                icon: 'icon-dot-circle-o',
                permission: 'product_category.read',
                sidebar: true,
                component: () =>
                    import ('../views/products-inventory/ProductsCategoryIndex'),
            },
            {
                path: '/inventory-rooms',
                name: 'inventoryRooms',
                title: 'Otaqlar',
                icon: 'icon-dot-circle-o',
                permission: 'inventory_rooms.read',
                sidebar: true,
                component: () =>
                    import ('../views/products-inventory/RoomsIndex'),
            },
        ]
    },

    {
        path: '/shop',
        name: 'portalshop',
        title: 'Portal Shops',
        icon: 'icon-shopping-bag',
        permission: 'shop.read',
        sidebar: true,
        component: () =>
            import ('../views/portalShops/PortalShopsIndex'),
    },
    {
        path: '/products',
        name: 'products',
        title: 'Məhsullar',
        icon: 'icon-shopping-bag',
        permission: 'products.read',
        sidebar: true,
        component: () =>
            import ('../views/products/ProductsIndex'),
    },

    {
        path: '*',
        title: 'Xərclər',
        icon: 'icon-money',
        permission: 'costs.read',
        sidebar: true,
        children: [{
                path: '/costs',
                name: 'costs',
                title: 'Xərclər',
                icon: 'icon-money',
                permission: 'costs.read',
                sidebar: true,
                component: () =>
                    import ('../views/costs/CostsIndex'),
            },
            {
                path: '/cost-categories',
                name: 'cost-categories',
                title: 'Xərc Kategoryaları',
                icon: 'icon-list2',
                permission: 'cost_categories.read',
                sidebar: true,
                component: () =>
                    import ('../views/costs/CostCategoriesIndex'),
            },
            
        ]
    },
    
    {
        path: '/order',
        name: 'order',
        title: 'crm.Sidebar.Orders',
        icon: 'icon-users',
        permission: 'order.read',
        sidebar: true,
        component: () =>
            import ('../views/order/OrderIndex'),
        children: [{
            path: '/order-new/:id?',
            name: 'order-new',
            title: 'crm.Sidebar.NewSale',
            icon: 'icon-users',
            permission: 'order.create',
            sidebar: false,
            component: () =>
                import ('../views/order/OrderAccept'),
        }, ]
    },
    {
        path: '/sale',
        name: 'sale',
        title: 'crm.Sidebar.Sales',
        icon: 'icon-money',
        permission: 'sale.read',
        sidebar: true,
        component: () =>
            import ('../views/sale/SaleIndex'),
    },
    {
        path: '*',
        title: 'Sertifikatlar',
        icon: 'icon-certificate',
        permission: 'certificates.read',
        sidebar: true,
        children: [{
                path: '/certificates',
                name: 'cerificates',
                title: 'Serifikatlar',
                icon: 'icon-certificate',
                permission: 'certificates.read',
                sidebar: true,
                component: () =>
                    import ('../views/certificates/CertificatesIndex'),
            },
            {
                path: '/used-certificates',
                name: 'İsftSertifikatlar',
                title: 'İstifadə olunmuş Sertifikatlar',
                icon: 'icon-certificate',
                permission: 'certificates.read',
                sidebar: true,
                component: () =>
                    import ('../views/certificates/UsedCertificates'),
            },
        ]
    },

    {
        path: '/report',
        name: 'report',
        title: 'crm.Sidebar.Reports',
        icon: 'icon-bar-chart-o',
        permission: 'report.read',
        sidebar: true,
        component: () =>
            import ('../views/report/ReportIndex'),
    },
    {
        path: '/blog',
        name: 'blog',
        title: 'crm.Sidebar.Blogs',
        icon: 'icon-bar-chart-o',
        permission: 'blog.read',
        sidebar: true,
        component: () =>
            import ('../views/blog/BlogIndex'),
    },
    {
        path: '/vacancies',
        name: 'vacancies',
        title: 'crm.Sidebar.Vacancies',
        icon: 'icon-bar-chart-o',
        permission: 'vacancies.read',
        sidebar: true,
        component: () =>
            import ('../views/vacancies/VacanciesIndex'),
    },
    {
        path: '/files',
        name: 'files',
        title: 'crm.Sidebar.Files',
        icon: 'icon-file-picture-o',
        permission: 'files.read',
        sidebar: true,
        component: () =>
            import ('../views/files/FilesIndex'),
    },
    {
        path: '/partners',
        name: 'partners',
        title: 'Partniyorlar',
        icon: 'icon-file-picture-o',
        permission: 'partners.read',
        sidebar: true,
        component: () =>
            import ('../views/partners/PartnersIndex'),
    },
    {
        path: '/slider',
        name: 'slider',
        title: 'crm.Sidebar.Sliders',
        icon: 'icon-photo1',
        permission: 'slider.read',
        sidebar: true,
        component: () =>
            import ('../views/slider/SliderIndex'),
    },
    {
        path: '/page',
        name: 'page',
        title: 'crm.Sidebar.Pages',
        icon: 'icon-question',
        permission: 'page.read',
        sidebar: true,
        component: () =>
            import ('../views/page/PageIndex'),
    },
    {
        path: '*',
        title: 'Yönləndirmə səhifəsi',
        icon: 'icon-website',
        permission: 'for_whom.read',
        sidebar: true,
        children: [{
                path: '/how-play',
                name: 'how-play',
                title: 'Necə oynanır',
                icon: 'icon-gamepad',
                permission: 'for_whom.read',
                sidebar: true,
                component: () =>
                    import ('../views/redirect-page/HowPlayIndex'),
            },
            {
                path: '/redirect-page',
                name: 'for-whom',
                title: 'Kimlər üçündür',
                icon: 'icon-users3',
                permission: 'for_whom.read',
                sidebar: true,
                component: () =>
                    import ('../views/redirect-page/ForWhomIndex'),
            },
            {
                path: '/best-questions',
                name: 'best-questions',
                title: 'Ən çox verilən suallar',
                icon: 'icon-question',
                permission: 'for_whom.read',
                sidebar: true,
                component: () =>
                    import ('../views/redirect-page/BestQuestionsIndex'),
            },
            {
                path: '/bq-categories',
                name: 'bq-categories',
                title: 'Suallar Categoriyası',
                icon: 'icon-question',
                permission: 'for_whom.read',
                sidebar: true,
                component: () =>
                    import ('../views/redirect-page/CategoriesIndex'),
            },
        ]
    },
    {
        path: '/department',
        name: 'department',
        title: 'crm.Sidebar.Departments',
        icon: 'icon-shop1',
        permission: 'department.read',
        sidebar: true,
        component: () =>
            import ('../views/department/DepartmentIndex'),
    },
    {
        path: '/franchise',
        name: 'franchise',
        title: 'Franchise',
        icon: 'icon-shop1',
        permission: 'franchise.read',
        sidebar: true,
        component: () =>
            import ('../views/franchise/FranchiseIndex'),
    },
    {
        path: '*',
        title: 'Endirimlər',
        icon: 'icon-award',
        permission: 'discount.read',
        sidebar: true,
        children: [{
                path: '/discount',
                name: 'discount',
                title: 'crm.Sidebar.Discounts',
                icon: 'icon-award',
                permission: 'discount.read',
                sidebar: true,
                component: () =>
                    import ('../views/discount/DiscountIndex'),
            },
            {
                path: '/discount-types',
                name: 'discount-types',
                title: 'crm.Sidebar.DiscountsTypes',
                icon: 'icon-award',
                permission: 'discount.read',
                sidebar: true,
                component: () =>
                    import ('../views/discount/DiscountTypes'),
            },
        ]
    },
    {
        path: '/payment-type',
        name: 'payment-type',
        title: 'crm.Sidebar.PaymentTypes',
        icon: 'icon-bookmark',
        permission: 'payment_type.read',
        sidebar: true,
        component: () =>
            import ('../views/payment-type/PaymentTypeIndex'),
    },
    {
        path: '/coins-promo-code',
        name: 'coins-promo-code',
        title: 'crm.Sidebar.CoinsPromoCode',
        icon: 'icon-coin',
        permission: 'coins.read',
        sidebar: true,
        component: () =>
            import ('../views/coins-promo-code/CoinsPromoCodeIndex'),
    },
    {
        path: '/coins',
        name: 'coins',
        title: 'crm.Sidebar.Coins',
        icon: 'icon-coin',
        permission: 'coins.read',
        sidebar: true,
        component: () =>
            import ('../views/coins/CoinsIndex'),
    },
    {
        path: '/user',
        name: 'user',
        title: 'crm.Sidebar.Users',
        icon: 'icon-users',
        permission: 'user.read',
        sidebar: true,
        component: () =>
            import ('../views/user/UserIndex'),
    },
    {
        path: '*',
        name: 'chat-bot',
        title: 'Chat Bot',
        icon: 'icon-message-circle',
        permission: 'holiday.read',
        sidebar: true,
        children: [{
                path: '/messages',
                name: 'messages',
                title: 'Mesajlar',
                icon: 'icon-message-circle',
                permission: 'holiday.read',
                sidebar: true,
                component: () =>
                    import ('../views/chatbot/MessagesIndex'),
            },
            {
                path: '/message-types',
                name: 'message-types',
                title: 'Mesaj tipləri',
                icon: 'icon-message-circle',
                permission: 'holiday.read',
                sidebar: true,
                component: () =>
                    import ('../views/chatbot/MessageTypes'),
            },
        ]
    },
    
    {
        path: '/director-info',
        name: 'director-info',
        title: 'crm.Sidebar.DirectorInfo',
        icon: 'icon-users',
        permission: 'director_info.read',
        sidebar: true,
        component: () =>
            import ('../views/director-info/DirectorIndex'),
    },
    {
        path: '/chat',
        name: 'chat',
        title: 'crm.Sidebar.Chat',
        icon: 'icon-users',
        permission: 'director_info.read',
        sidebar: true,
        component: () =>
            import ('../views/chat/Index'),
    },
    {
        path: '/qr-code',
        name: 'qr-code',
        title: 'crm.Sidebar.QrCodes',
        icon: 'icon-qrcode',
        permission: 'qr_codes.read',
        sidebar: true,
        component: () =>
            import ('../views/qr-codes/QrCodesIndex'),
    },
    {
        path: '*',
        title: 'crm.Sidebar.Setting',
        icon: 'icon-cogs',
        permission: [
            'language.read',
            'permission.create',
            'seo.read',
            'setting.read',
        ],
        sidebar: true,
        children: [
            /*
             * Holidays
             * */
            {
                path: '/holidays',
                name: 'holidays',
                title: 'crm.Sidebar.SettingHolidays',
                icon: 'icon-gift',
                permission: 'holiday.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/holidays/HolidaysIndex'),
            },
            /*
             * Holidays
             * */
            {
                path: '/analytics',
                name: 'analytics',
                title: 'crm.Sidebar.Statistics',
                icon: 'icon-statistics',
                permission: 'holiday.read',
                sidebar: true,
                component: () =>
                    import ('../views/analytics/Index'),
            },
            /*
             * Language
             * */
            {
                path: '/language',
                name: 'language',
                title: 'crm.Sidebar.SettingLanguages',
                icon: 'icon-language',
                permission: 'language.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/language/LanguageIndex'),
            },
            /*
             * Translate
             * */
            {
                path: '/translate',
                name: 'translate',
                title: 'crm.Sidebar.SettingTranslates',
                icon: 'icon-repeat',
                permission: 'language.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/language/LanguageTranslate'),
            },
            /*
             * Permission
             * */
            {
                path: '/permission',
                name: 'permission',
                title: 'crm.Sidebar.SettingPermissions',
                icon: 'icon-award',
                permission: 'permission.create',
                sidebar: true,
                component: () =>
                    import ('../views/setting/permission/PermissionIndex'),
                children: [{
                    path: '/permission/option/:id',
                    name: 'permission.option',
                    title: 'crm.Sidebar.SettingPermissionsParams',
                    icon: 'icon-grid',
                    permission: 'permission.create',
                    sidebar: true,
                    component: () =>
                        import ('../views/setting/permission/PermissionOption'),
                }, ]
            },
            /*
             * Seo
             * */
            {
                path: '/seo',
                name: 'seo',
                title: 'crm.Sidebar.SettingSeoMetaTag',
                icon: 'icon-search',
                permission: 'seo.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/seo/SeoIndex'),
            },
            /*
             * General
             * */
            {
                path: '/general',
                name: 'general',
                title: 'crm.Sidebar.SettingMain',
                icon: 'icon-cogs',
                permission: 'setting.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/general/GeneralIndex'),
            },
            /*
             * Work Time
             * */
            {
                path: '/work-time',
                name: 'work-time',
                title: 'crm.Sidebar.SettingWorkTime',
                icon: 'icon-clock',
                permission: 'setting.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/work-time/WorkTimeIndex'),
            },
            /*
             * Logo
             * */
            {
                path: '/logo',
                name: 'logo',
                title: 'crm.Sidebar.SettingLogo',
                icon: 'icon-picture',
                permission: 'setting.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/logo/LogoIndex'),
            },
            /*
             * Html
             * */
            {
                path: '/html',
                name: 'html',
                title: 'crm.Sidebar.SettingHtml',
                icon: 'icon-code1',
                permission: 'setting.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/html/HtmlIndex'),
            },
            /*
             * Social Page
             * */
            {
                path: '/social-page',
                name: 'social-page',
                title: 'crm.Sidebar.SettingSocialPage',
                icon: 'icon-link',
                permission: 'setting.read',
                sidebar: true,
                component: () =>
                    import ('../views/setting/social-page/SocialPageIndex'),
            },
        ]
    },
    /*
     * Auth
     * */
    {
        path: '/auth',
        name: 'auth',
        children: [
            /*
             * Login
             * */
            {
                path: '/auth/login',
                name: 'auth.login',
                component: () =>
                    import ('../views/auth/AuthLogin'),
            },
            /*
             * Lock Screen
             * */
            {
                path: '/auth/lockscreen',
                name: 'auth.lockscreen',
                component: () =>
                    import ('../views/auth/AuthLockscreen')
            },
        ]
    },
]