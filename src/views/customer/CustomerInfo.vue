<template>
    <page v-if="info.id">
        <page-head :title="pageTitle">
            <div class="flex items-center space-x-3">

            </div>
        </page-head>

        <page-body>
            <grid cols="2">
                <div class="space-y-4">
                    <card>
                        <card-head title="Müştəri məlumatları"/>
                        <card-body>
                            <div class="flex flex-col space-y-2">
                                <p><b>Ad, soyad</b>: {{ info.fullname }}</p>
                                <p><b>Email</b>: {{ info.email }}</p>
                                <p><b>Telefon</b>: {{ info.phone }}</p>
                                <p><b>Oynadığı oyun sayı</b>: {{ info.sales_count }}</p>
                            </div>
                        </card-body>
                    </card>

                    <card>
                        <card-head title="İştirak etdiyi oyunlar"/>
                        <card-body>
                            <div class="flex flex-col space-y-2">
                                <div v-for="(i, key) in info.sales" :key="key" class="border border-gray-200 p-2">
                                    <grid cols="2">
                                        <div class="space-y-2">
                                            <p><b>Oyun adı:</b> {{ i.game.name }}</p>
                                            <p><b>Tarix:</b> {{ i.order_date }}</p>
                                            <p v-if="i.customer_comment"><b>Müştəri rəyi:</b> {{ i.customer_comment }}</p>
                                            <p v-if="i.reception_comment"><b>Resepşın rəyi:</b> {{ i.reception_comment }}</p>
                                            <p v-if="i.reception_review"><b>Resepşın dəyərləndirməsi:</b> {{ i.reception_review }}</p>
                                            <p v-if="i.users"><b>Digər iştirakçılar:</b> {{ i.users.filter(i => i.user_id !== info.id).map(i => i.user.fullname).join(', ') }}</p>
                                        </div>
                                    </grid>
                                </div>
                            </div>
                        </card-body>
                    </card>
                </div>
                <div>
                    <card>
                        <card-head title="İştirak etdiyi oyun sayı"/>
                        <card-body>
                            <table class="w-full table-auto border">
                                <thead class="border-b">
                                <tr>
                                    <th class="p-2 border-r" style="text-align: left">Adı</th>
                                    <th class="p-2" style="width: 100px">Sayı</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, key) in items" :key="key" class="border-b">
                                    <td class="p-2 border-r">{{item.name}}</td>
                                    <td class="p-2 text-center">{{item.count}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </card-body>
                    </card>
                </div>
            </grid>
        </page-body>
    </page>
</template>

<script>
/*
 * Import Components
 * */
import {mapActions, mapState} from 'vuex';

const modalId = 'createModal';
const translateKey = 'crm.Customer';

export default {
    name: "CustomerInfo",
    data() {
        return {
            translateKey,
            info: {},
            items: []
        }
    },
    computed: {
        permission() {
            return this.currentPage.permission;
        },
        pageTitle() {
            return this.translate(translateKey + '.Label.InfoTitle', {search: '{name}', replace: this.info.fullname})
        },
        routeTab() {
            return {
                title: this.pageTitle
            }
        }
    },
    methods: {
        ...mapActions('CustomerStore', ['getCustomerInfo']),
    },
    created() {
        this.getCustomerInfo({id: this.$route.params.id})
        .then(r => {
            this.info = r.items;
            this.items = r.games;
        })
        .catch(err => {

        })
    }
}
</script>

<style scoped>

</style>
