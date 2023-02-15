<template>
    <page>
        <page-head>
            
        </page-head>

        <page-body>
            <!-- <div class="h-auto w-full border ">
                <div class="flex flex-col md:flex-row ...">
                    <div class="flex-1 flex-initial border p-5" style="width:200px;">
                        <div v-for="(item, index) in conversations">
                            <ConItem :item="item" v-on:click.native="setConversation(item)"/>
                        </div>
                    </div>
                    <div class="flex-auto border p-5">
                        <ConTitle :item="currentConversation"/>
                        <Conversation/>
                    </div>
                    

                </div>
            </div> -->

<!-- This is an example component -->
<div class="container mx-auto shadow-lg rounded-lg">
        <!-- headaer -->
    <!-- <div class="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <div class="font-semibold text-2xl">GoingChat</div>
      <div class="w-1/2">
        <input
          type="text"
          name=""
          id=""
          placeholder="search IRL"
          class="rounded-2xl bg-gray-100 py-3 px-5 w-full"
        />
      </div>
      <div
        class="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
      >
        RA
      </div>
    </div> -->
    <!-- end header -->
    <!-- Chatting -->
    <div class="flex flex-row justify-between bg-white">
      <!-- chat list -->
      <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto h-96" >
        
        <!-- border-l-4 border-blue-400 -->
        <div v-if="newCons">
          <ConItem :item="index"
          v-on:click.native="setConversation(index)"
          v-for="(index, key) in newCons" :key="key"
          :newMess="true"
          />
        </div>

        <ConItem :item="index"
        v-on:click.native="setConversation(index)"
        v-for="(index, key) in conversations" :key="key"
        :newMess="false"
        />
        <!-- :customcl="index.id == currentConversation.id ? 'border-l-4 border-blue-400' : ''" -->


        <!-- end user list -->
      </div>
      <!-- end chat list -->
      <!-- message -->
      <div class="w-full px-5 flex flex-col justify-between ">
        
          <div class="flex flex-col mt-5 overflow-y-auto h-96" id="chatArea">
            <div v-if="currentConversation">
              <!-- {{index.type == 'callcenter' ? 'justify-end' : 'justify-start'}} -->
              <div class="flex  mb-4" v-for="(index, key) in currentConversation.messages" :key="key"
                  v-bind:class="{
                    'justify-end': (index.type == 'callcenter'),
                    'justify-start': (index.type == 'user'),
                }"
                >
                <div
                  class="mr-2 py-3 px-4   text-white"
                  v-bind:class="{
                    'bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl': (index.type == 'callcenter'),
                    'bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl': (index.type == 'user'),
                }"
                  >
                  {{index.text}}
                </div>
              </div>
            </div>
          </div>
        

          <div class="py-5"  v-if="currentConversation">
            <input
              class="flex-auto bg-gray-300 py-3 px-3 rounded-xl"
              style="width:46rem"
              type="text"
              placeholder="type your message here..."
              v-model="form.text"
              @keyup.enter="sendMessage()"
            />
            <button class="bg-blue-300 flex-auto w-auto py-3 px-4 rounded-xl ml-2" @click="sendMessage()">Send</button>
          </div>
        </div>
      </div>
      <!-- end message -->
      
      </div>


        </page-body>

        
    </page>
</template>

<script>



import {mapActions, mapState} from 'vuex';
// import Conversation from './conversation.vue';
import ConItem from './conItem.vue';
// import ConTitle from './conTitle.vue';

export default {
    
    name: "Index",
    components: { ConItem, },
    data(){
        return {
            currentConversation: null,
            newCons: [],
            form: {
              conversation_id: null,
              text: null
            },
        }
    },
    
    watch:{
      conversations(){
        this.setConversation(this.conversations[0]);
        
        var pusher = new Pusher('c3d53eedfdf77fe76299', {
            cluster: 'ap2'
        });

        var channel = pusher.subscribe('chat');
        var chatConsChannel = pusher.subscribe('conversations');

        let that = this;
        channel.bind('event'+this.currentConversation.id+'user', function(data) {
            const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1144-me-too.mp3');
            audio.play();
            that.currentConversation.messages.push(data.data);
            that.scrollToEnd();
        });

        chatConsChannel.bind('event-conversations', function(data) {
            const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1144-me-too.mp3');
            audio.play();
            that.newCons.push(data.data);
        });
        console.log('event'+this.currentConversation.id+'user');
      },
      
      // currentConversation(){
      //   this.scrollToEnd();
        
      // }
    },
    computed: {
        ...mapState('MessagesStore', ['messages', 'conversation', 'conversations']),

        // sortedCons: function() {
        //   function compare(a, b) {
        //     if (a < b)
        //       return -1;
        //     if (a > b)
        //       return 1;
        //     return 0;
        //   }

        //   return this.conversations.sort(compare);
        // }

    },
    methods: {
        ...mapActions('MessagesStore', ['getConversations', 'setMessage']),

        scrollToEnd: function() {    	        
          var container = this.$el.querySelector("#chatArea");
          container.scrollTop = container.scrollHeight;
        },

        setConversation(data){
            this.currentConversation = data;
            this.scrollToEnd();
            this.$forceUpdate();
        },
        sendMessage(){
          var result = {
              conversation_id: this.currentConversation.id,
              text: this.form.text 
          };
          console.log(result);
          this.setMessage(result);
        }
    },
    created(){
        this.getConversations();
    },
    
}
</script>

<style scoped>

</style>
