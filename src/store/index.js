import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import AppStore from "./modules/app.store";
import AuthStore from "./modules/auth.store";
import UserStore from "./modules/user.store";
import PermissionStore from "./modules/permission.store";
import LanguageStore from "./modules/language.store";
import SeoStore from "./modules/seo.store";
import SettingStore from "./modules/setting.store";
import DepartmentStore from "./modules/department.store";
import DiscountStore from "./modules/discount.store";
import GameStatusStore from "./modules/game-status.store";
import PaymentTypeStore from "./modules/payment-type.store";
import GameLevelStore from "./modules/game-level.store";
import GameLanguageStore from "./modules/game-language.store";
import GameStore from "./modules/game.store";
import EmployeeTypeStore from "./modules/employee-type.store";
import EmployeeStore from "./modules/employee.store";
import CustomerStore from "./modules/customer.store";
import OrderStore from "./modules/order.store";
import SaleStore from "./modules/sale.store";
import BlogStore from "./modules/blog.store";
import VacanciesStore from "./modules/vacancies.store";
import FilesStore from "./modules/files.store";
import SliderStore from "./modules/slider.store";
import PageStore from "./modules/page.store";
import SquidGameStore from "./modules/squid-game.store";
import AnalyticsStore from './modules/analytics.store';
import GameCategoriesStore from './modules/game-categories.store';
import TestStore from './modules/test.store';
import PortalShopsStore from './modules/portalshop.store';
import CostsStore from './modules/costs.store';
import CostCategoriesStore from './modules/cost-categories.store';
import PartnersStore from './modules/partners.store';
import ProductsStore from './modules/products.store';
import QuestionStore from './modules/squid-game-questions.store';
import CharacterStore from './modules/squid-game-characters.store';
import ProductsInventoryStore from './modules/products-inventory.store';
import ProductsCategoryStore from './modules/products-category.store';
import InventoryRoomsStore from './modules/inventory-rooms.store';
import ForWhomStore from './modules/for-whom.store';
import HowPlayStore from './modules/how-play.store';
import BestQuestionsStore from './modules/best-questions.store';
import BQCategoriesStore from './modules/bq-categories.store';
import FranchiseStore from './modules/franchise.store';
import CoinsStore from './modules/coins.store';
import CoinsPromoCodeStore from './modules/coins-promo-code.store';
import CertificatesStore from './modules/certificates.store';
import UsedCertificatesStore from './modules/used-certificates.store';
import EmployeeBonusStore from './modules/employee-bonus.store';
import BonusTypeStore from './modules/bonus-type.store';
import HolidayStore from './modules/holidays.store';
import DiscountTypesStore from './modules/discountTypes.store';
import DirectorInfoStore from './modules/director-info.store';
import MessagesStore from './modules/messages.store';
import QrCodesStore from './modules/qr-codes.store';
import CommentsStore from './modules/comments.store';
import StaffStore from './modules/staff.store';
import BotMessagesStore from './modules/chat-bot-messages.store';
import BotMessageTypeStore from './modules/chat-bot-message-type.store';


export default new Vuex.Store({
    modules: {
        AppStore,
        AuthStore,
        UserStore,
        PermissionStore,
        LanguageStore,
        SeoStore,
        SettingStore,
        DepartmentStore,
        DiscountStore,
        GameStatusStore,
        PaymentTypeStore,
        GameLevelStore,
        GameLanguageStore,
        GameStore,
        EmployeeTypeStore,
        EmployeeStore,
        CustomerStore,
        OrderStore,
        SaleStore,
        BlogStore,
        VacanciesStore,
        FilesStore,
        SliderStore,
        PageStore,
        SquidGameStore,
        AnalyticsStore,
        GameCategoriesStore,
        TestStore,
        PortalShopsStore,
        CostsStore,
        PartnersStore,
        ProductsStore,
        QuestionStore,
        CharacterStore,
        ProductsInventoryStore,
        ProductsCategoryStore,
        InventoryRoomsStore,
        ForWhomStore,
        HowPlayStore,
        BestQuestionsStore,
        BQCategoriesStore,
        FranchiseStore,
        CoinsStore,
        CoinsPromoCodeStore,
        CertificatesStore,
        UsedCertificatesStore,
        EmployeeBonusStore,
        BonusTypeStore,
        CostCategoriesStore,
        HolidayStore,
        DiscountTypesStore,
        DirectorInfoStore,
        MessagesStore,
        QrCodesStore,
        CommentsStore,
        StaffStore,
        BotMessagesStore,
        BotMessageTypeStore
    }
});