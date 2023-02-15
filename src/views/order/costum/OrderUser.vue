<template>

</template>

<script>
/*
 * Import Components
 * */
import TreeSelect from '@riophae/vue-treeselect'
import { ASYNC_SEARCH } from '@riophae/vue-treeselect'
import {mapActions, mapState} from "vuex";

const translateKey = 'crm.Order';

export default {
    name: "OrderUser",
    components: {TreeSelect},
    props: {
        price: {
            default: null
        },
        playerCount: {
            default: null
        }
    },
    data() {
        return {
            translateKey,
            objectIndex: null,
            form: [],
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name + ' ' + surname + ( i.email ? ' (' + i.email + ')' : '')
                }
            },
            columns: [
                {
                    caption: 'crm.Customer.Label.Fullname',
                    dataField: 'name',
                    show: true
                },
                {
                    caption: 'crm.Customer.Label.Fullname',
                    dataField: 'surname',
                    show: true
                },
                {
                    caption: 'crm.Customer.Label.Email',
                    dataField: 'email',
                    show: true
                },
            ]
        }
    },
    watch: {
        form(val) {
            console.log(val);
        }
    },
    computed: {
        ...mapState('UserStore', ['users']),
        ...mapState('DiscountStore', ['discounts']),
    },
    methods: {
        ...mapActions('UserStore', ['getSelectUsers']),
        ...mapActions('DiscountStore', ['getSelectDiscounts']),
        removeCard(index) {
            this.form.splice(index, 1);
        },
        newCard() {
            this.form.push({
                user_id: null,
                discount_id: null,
                price: null
            })
        },
        calcPrice(index) {
            const obj = this.form[index];
            let price = 0;
            const discount = this.discounts.find(i => i.id === obj.discount_id);
            if (discount && obj) {
                price = this.price - (this.price * discount.interest) / 100;
                obj.price = price;
                return price;
            }
            price = this.price;
            return price;
        },
        createFormObject() {
            this.form = [];
            if (this.player_count > 1) {
                for (let i = 0; i < this.player_count; i++) {
                    this.form.push({
                        user_id: null,
                        discount_id: null,
                        price: null,
                    })
                }
            }
            else {
                this.form.push({
                    user_id: null,
                    discount_id: null,
                    price: null,
                })
            }
        },
        loadOptions({action, searchQuery, callback}) {
            if (action === ASYNC_SEARCH) {
                this.getSelectUsers({search: searchQuery, limit: 40})
                .then(r => {
                    console.log(r);
                    callback(null, this.users)
                })
            }
        },
    },
    created() {
        this.getSelectUsers({limit: 40});
        this.getSelectDiscounts();
        this.createFormObject();
    }
}
</script>

<style scoped>

</style>
