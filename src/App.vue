<template>
 <div>    
    <navigation />
        <transition name="fade">
             <router-view></router-view>
        </transition>

</div>
</template>
<script>
import navigation from './components/Navigation.vue';

export default {
  components: {
    navigation
  }

}

</script>