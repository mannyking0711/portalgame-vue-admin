<template>

    <div
          class="flex flex-row py-4 px-2 justify-center items-center border-b-2 cursor-pointer"
          :class="customcl"
        >
          <div class="w-1/4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
              class="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="text-lg font-semibold">{{item.user_ip}}</div>
            <span class="text-gray-500">{{ item.messages[(item.messages.length-1)].text }} </span><br>
            <span class="text-gray-500 text-xs">{{ item.messages[(item.messages.length-1)].date }} </span>
            <span v-if="newMess" class=" text-red-600 p-2 rounded-md ml-2">Yeni Mesaj</span>

          </div>
    </div>
</template>

<script>
export default {
 props: ['item', 'customcl', 'newMess']
}
</script>