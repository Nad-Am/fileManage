import { defineStore } from "pinia";
import { DoAxios } from "@/api";
export const useUserStore =  defineStore('user',{
    state:() => ({
        useTransitionFallthrough:null,
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
          try{
              const data = await DoAxios('/api/users/login','post',userData,false);
              // console.log(data.tokenValue,data.data);
              this.userToken = data.data.tokenValue;
              localStorage.setItem('userToken', this.userToken);
            
          } catch(e) {
            console.log("登录失败",e);
          }
        },
        logout() {
          this.userInfo = null;
          localStorage.removeItem('userToken');
          this.isLoggedIn = false;
        }
      }
})