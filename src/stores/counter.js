import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useIdStore = defineStore('counter', () => {
  const index = ref(-1);
  const Idstack = reactive([]);
  const openNewFlied = ref(true);
  const isSearch = reactive({});

  const pushId = (newIdInfor) => {
    Idstack.push(newIdInfor)
    index.value = index.value + 1;
  }

  const backword = () => {
    if(index.value <= 0) return
    Idstack.splice(index.value,1);
    index.value = index.value - 1
  }

  const turnId = (id) => {
    index.value = id;
    Idstack.splice(id + 1,Idstack.length - id);
  }

  const cleareSotre = () => {
    index.value = -1;
    Idstack.splice(0,Idstack.length);
  }

  const getNow = () => {
    return Idstack[index.value]
  }
  
  return {index, Idstack,openNewFlied,isSearch, backword, pushId, turnId,cleareSotre,getNow}
})
