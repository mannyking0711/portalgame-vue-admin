<template>
    <div>
        <dropdown class="py-2">
            <dropdown-button :arrow="false" class="text-left" style="background: transparent; border: none; padding: 10; margin-right: 20px;">
                <div class="text-white">
                    <p v-bind:style="[this.messages.length > 0 ? {'border-color': 'yellow', 'color': 'yellow', 'border':'2px solid'} : {'border-color': '#fff'}]"  class="text-sm font-medium rounded-full  border p-2"><i class="icon-bell1"></i> {{ this.messages.length || 0 }} </p>
                </div>
            </dropdown-button>
            <dropdown-items title-class=" border-b border-gray-200 mb-2">
                <div v-if="messages">
                    <dropdown-item v-for="(message, key) in messages" :key="key">
                        <p>{{message.message}}</p> 
                    </dropdown-item>
                </div>
            </dropdown-items>
        </dropdown>

    </div>
</template>
<script src="https://js.pusher.com/7.2/pusher.min.js"></script>
<script>
/*
 * Import Components
 * */
import {mapActions} from 'vuex';
import Pusher from "pusher-js";

const translateKey = 'crm.User';

export default {
    name: "AppNotifications",

    data() {
        return {
            translateKey,
            messages: [],
            // modelShow: false,
        }
    },
    mounted() {
        
        // console.log('Mounted Component message');

        Pusher.logToConsole = false;

        var pusher = new Pusher('c3d53eedfdf77fe76299', {
            cluster: 'ap2'
        });
        var channel = pusher.subscribe('my-channel'); //(this.user.department.id != null ? 'department-channel-'+this.user.department.id : 'admin-channel')
        let that = this;
        channel.bind('my-event'+this.user.department.id, function(data) {
            const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3');
            audio.play();
            that.messages.push(data);
            // console.log(that.messages.length);
            // console.log(that.messages);
        });
    },
    
    
}
</script>

<style scoped>

</style>
