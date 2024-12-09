import { defineStore } from "pinia";
import { DoAxiosWithErro } from "@/api";
export const useUserStore =  defineStore('user',{
    state:() => ({
        useInfo:null,
        userToken: localStorage.getItem('userToken') || '',
        isLoggedIn:false
    }),
    getters: {
        isAuthenticated: (state) => !!state.userInfo,
        userName: (state) => (state.userInfo ? state.userInfo.name : 'Guest')
      },
    
      // 3. 定义 actions
      actions: {
        async login(userData) {
              const data = await DoAxiosWithErro('/api/users/login','post',userData,false);
              this.userToken = data.data.saTokenInfo.tokenValue;

              this.useInfo = data.data;
              localStorage.setItem('userToken', this.userToken);
              
        },
        async logout() {
          this.userInfo = null;
          await DoAxiosWithErro('/api/users/logout','post',{},true);
          localStorage.removeItem('userToken');
          this.isLoggedIn = false;
        }
      }
})