<template>
    <div class="relative h-32 w-32 ...">
            <div class="absolute inset-x-0 top-0 h-16 ...">
                {{item.user_ip}}        
            </div>
        </div>
</template>

<script>
export default {
 props: ['item']
}
</script>