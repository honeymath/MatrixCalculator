Vue.component('sizer',{
  props:{
    title:''
  },
  data() {
        return {
    show:false
        };
    },
  template:` 
  <div>
  <button v-on:click="show=!show" v-html="title"></button>
  <div v-if="show">
            <div>select size:</div>
            <div>
            <button v-on:click="tmd('1')">1</button>
            <button>2</button>
            <button>3</button>
            </div>
            <div>
            <button>4</button>
            <button>5</button>
            <button>6</button>
            </div>
            <div>
            <button>7</button>
            <button>8</button>
            <button>9</button>
            </div>
        </div>
    </div>`,
    methods:{
      tmd(s){this.$emit('ala')}
    }
})