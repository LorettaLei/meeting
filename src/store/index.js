import Vue from 'vue'
import Vuex from 'vuex'
import { ISAPP } from '../config'
import action from './action'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    rooms: [],
    meetings: []
  },
  mutations: {
  },
  actions: {
    async login({ state },data) {
      let userInfo = localStorage.getItem('meeting_userInfo');
      if(userInfo && userInfo!='null' && userInfo!='undefined'){
          state.userInfo = JSON.parse(userInfo)
          return;
      }else if (data && data.code && ISAPP) {
        let d = await action.login(data);
        if (d.status === 200) {
          state.userInfo = d.result;
          localStorage.setItem('meeting_userInfo', JSON.stringify(d.result));
          return;
        }
      } else if (ISAPP) {
          let d = await action.getAuth();
          if (d.authurl) {
            window.location.href = d.authurl;
        }
      }else{
        state.userInfo = {
          userId: "1234567",
          name: "小赵",
          mobile: "13700000000",
          position: "前端开发工程师",
          gender: "1",
          email: "13718141993@163.com",
          avatar: "http://wework.qpic.cn/bizmail/0Hbx9icAVicyjbUHj2MK9fOvibxOGRD2scg0mic3ory6JYmcWGveTbQoBA/0",
          thumb_avatar: "http://wework.qpic.cn/bizmail/0Hbx9icAVicyjbUHj2MK9fOvibxOGRD2scg0mic3ory6JYmcWGveTbQoBA/100",
          telephone: "",
          enable: 1,
          status: 1,
          address: ""
        };
        return;
      }
    },
    async getRooms({ state }, data) {
      let d;
      if (ISAPP) {
        d = await action.getRooms(data)
        console.log(d.status,d.result)
        if (d.status === 200) {
          state.rooms = d.result;
        }
      } else {
        d = [
          {
            id: 1,
            name: 'a会议室'
          },
          {
            id: 2,
            name: 'b会议室'
          }
        ]
        state.rooms = d
      }
      return d;
    },
    async getMeetings({ state }, data) {
      let d;
      if (ISAPP) {
        d = await action.getMeetings(data)
        if (d.status === 200) {
          state.meetings = d.result;
        }
      } else {
        d = [
          {
            id: 1,
            title: '周OKR会议',
            owner: 'Jim',
            created: 1587882262693,
            start: 1588127400000,
            end: 1588132800000,
            type: 'once',
            room: 1,
            roomName: 'a会议室'
          },
          {
            id: 2,
            title: '许愿池二期',
            owner: '张丹',
            created: 1587882528950,
            start: 1588141800000,
            end: 1588145400000,
            type: 'once',
            room: 1,
            roomName: 'a会议室'
          },
          {
            id: 4,
            title: '许愿池二期',
            owner: '张丹',
            created: 1587882528950,
            start: 1588145400000,
            end: 1588149000000,
            type: 'once',
            room: 1,
            roomName: 'a会议室'
          },
          {
            id: 3,
            title: '周OKR会议',
            owner: 'Jim',
            created: 1587882262693,
            start: 1587880800000,
            end: 1587891600000,
            type: 'once',
            room: 1,
            roomName: 'a会议室'
          }
        ]
        state.meetings = d
      }
      return d;
    }
  },
  modules: {
  }
})
