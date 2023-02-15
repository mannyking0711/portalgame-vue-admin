<template>
    <div v-if="applicationStart" class="h-full">
        <template v-if="isLogin && user.permission">
            <app-layout-default v-if="user.permission.id > 1">
                <router-tab :lang="tabTranslate" :keep-last-tab="false" restore/>
            </app-layout-default>
            <div v-else class="w-full h-full flex items-center justify-center">
                <div class="w-full lg:w-96 flex flex-col space-y-4">
                    <alert icon="icon-info" property="danger">{{ translate('notification.UserNotAccess.Description') }}</alert>
                    <app-button class="justify-center" @click="userLogout">
                        {{ translate('button.Logout') }}
                    </app-button>
                </div>
            </div>
        </template>
        <app-layout-auth v-else>
            <router-view />
        </app-layout-auth>
    </div>
</template>

<script>

import AppLayoutDefault from "./layouts/AppLayoutDefault";
import AppLayoutAuth from "./layouts/AppLayoutAuth";
import {mapActions} from "vuex";

export default {
    components: {AppLayoutAuth, AppLayoutDefault},
    data() {
        return {
            tabTranslate: {
                tab: {
                    //untitled: 'Bilinməyən',
                },
                contextmenu: {
                    refresh: 'Yenilə',
                    refreshAll: 'Hamısını yenilə',
                    close: 'Bağla',
                    closeLefts: 'Sol tərəfdəkiləri bağla',
                    closeRights: 'Sağ tərəfdəkiləri bağla',
                    closeOthers: 'Hamsını bağla'
                },
                msg: {
                    keepLastTab: ''
                }
            }
        }
    },
    computed: {
        isLogin() {
            return this.token ? this.token : localStorage.token;
        },
    },
    methods: {
        ...mapActions('AuthStore', ['logout']),
        /*
         * User Logout
         * */
        userLogout() {
            this.logout()
            .then(r => {
                window.location.reload();
            })
        },
    },
    created() {
        this.start();
    }
}
</script>
