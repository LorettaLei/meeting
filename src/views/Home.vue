<template>
  <div class="home">
    <div class="home-btn">
      <div class="btn" @click.stop="popAddShow=true;form.unique='';">立即预定</div>
    </div>
    <div class="home-avatar">
      <img :src="userInfo.avatar" :alt="userInfo.name" >
    </div>
    <div class="home-con">
      <div class="meeting" v-for="ele in meetings" :key="ele._id">
        <div class="meeting-detail">
          <div class="meeting-detail-btn" v-if="userInfo.userid===ele.owner">
            <span class="btn cancel" @click.stop="delOne(ele)">取消</span>
            <span class="btn" @click.stop="editOne(ele)">编辑</span>
          </div>
          <div class="meeting-detail-btn" v-else>
            <span class="btn" @click.stop="callOne(ele)">协调</span>
          </div>
          <div class="meeting-detail-title">
            <p class="date">{{base_numToWeek(ele.date)}}</p>
            <p class="title">{{ele.title}}</p>
            <p class="description">{{ele.description}}</p>
          </div>
          <div class="meeting-detail-other">
            <p class="time">{{base_numToTime(ele.start)}} - {{base_numToTime(ele.end)}}</p>
            <p>预约人：{{ele.ownerName}}</p>
          </div>
        </div>
      </div>
      <div class="empty meeting"></div>
      <div class="empty meeting"></div>
    </div>
    <div class="pop-add" v-if="popAddShow" @click.stop="popMeeting.visible=false;">
      <div class="pop-add-title">
        <p>会议预约</p>
      </div>
      <div class="pop-add-con">
        <div class="form">
          <div class="form-label">会议室</div>
          <div class="form-item">
            <radio-group v-model="form.room" direction="horizontal" @change="roomChange">
              <Radio v-for="(item,index) in rooms" :key="item.id" :name="index">{{item.name}}</Radio>
            </radio-group>
          </div>
        </div>
        <div class="week">
          <div class="week-line">
            <span v-for="item in weeks" :class="{active:form.date==item.date}" :key="item.date" @click.stop="form.date = item.date;initTimeLine()"></span>
          </div>
          <div class="week-num">
            <span v-for="item in weeks" :key="item.date">{{item.name}}</span>
          </div>
        </div>
        <div class="time">
          <div class="time-line">
            <span v-for="item in timeLines" :key="item.times" :class="item.type" @click.stop="choose(item)"></span>
          </div>
          <div class="time-num">
            <span v-for="item in times" :key="item">{{item}}</span>
          </div>
        </div>
        <div class="popMeeting" @click.stop v-if="popMeeting.visible">
          <div class="popMeeting-con">
            <h3>{{popMeeting.name}}</h3>
            <p>{{popMeeting.ownerName}}</p>
            <p>{{popMeeting.start}} - {{popMeeting.end}}</p>
          </div>
        </div>
        <template v-if="form.chooseTime">
          <div class="form">
            <div class="form-label">时间</div>
            <div class="form-item">
              <select v-model="form.startTimes" :selected="form.selected">
                <option v-for="item in timeLines" :key="item.times" :disabled="item.type==='locked' && !(form.unique && item.data && userInfo.userid===item.data.owner)" :value="item.times">{{item.times}}</option>
              </select>
              -
              <select v-model="form.endTimes" @change="check">
                <option v-for="item in timeLines" :key="item.times" :disabled="item.type==='locked' && !(form.unique && item.data && userInfo.userid===item.data.owner)" :value="item.times">{{item.times}}</option>
              </select>
            </div>
          </div>
          <div class="form">
            <div class="form-label">主题</div>
            <div class="form-item">
              <input type="text" v-model="form.theme" @input="check" length="30" />
            </div>
          </div>
          <div class="form">
            <div class="form-label">备注</div>
            <div class="form-item">
              <textarea v-model="form.description"></textarea>
            </div>
          </div>
        </template>
      </div>
      <div class="pop-add-bottom" v-if="form.chooseTime">
        <div class="btn" @click="popAddShow=false">取消</div>
        <div class="btn primary" :class="{wait:form.waiting}" @click="submit">发起预约</div>
      </div>
    </div>
  </div>
</template>
<script>
import action from '../store/action'
import { RadioGroup,Radio,Dialog } from 'vant'
export default {
  components: { RadioGroup,Radio },
  data(){
    return {
      today: '',
      popAddShow: false,
      form: {
        room: 0,
        chooseTime: false,
        waiting: true,
        selected: '',
      },
      popMeeting: {
        visible: false,
        name: '',
        owner: '',
        start: '',
        end: '',
      },
      timeLines: [],
      weeks: [],
      times: ['10','11','12','13','14','15','16','17','18','19','20'],
    }
  },
  computed:{
    rooms(){
      return this.$store.state.rooms||[]
    },
    meetings(){
      return this.$store.state.meetings||[];
    },
    userInfo(){
      return this.$store.state.userInfo||{};
    }
  },
  created(){
    let date = this.base_timeToDate(+new Date()).replace(/\./g,'');
    this.form.date = date;
    this.today = date;
    console.log(this.form.date)

    this.initWeeks();

    this.form.room = 0;
    this.$store.dispatch('getRooms').then(()=>{
      this.getMeetings();
    })

    this.$nextTick(()=>{
      this.initTimeLine()
      document.addEventListener('click',()=>{
        console.log(222)
        this.popMeeting.visible = false;
        this.form.chooseTime = false;
        this.popAddShow = false;
      })
    })
  },
  methods:{
    getMeetings(){
      this.$store.dispatch('getMeetings',{date:this.today }).then(()=>{
        this.initTimeLine();
      });
    },
    initWeeks(){
      let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],date;
      this.weeks = [];
      for(let i=0;i<7;i++){
        date = new Date(+new Date() + i*24*60*60*1000)
        this.weeks.push({
          name: weeks[date.getDay()],
          date: this.base_timeToDate(date.getTime()).replace(/\./g,'')
        })
      }
    },
    initTimeLine(){
      console.log(this.timeLines,this.form.chooseTime)
      this.timeLines = [];
      let used=false,data=null,times;
      for(let i=0;i<20;i++){
        used = false;
        data = null;
        times = parseInt(parseInt((10*60 + i*30)/60) + '' + (i % 2 ? '30':'00'));
        for(let j = 0; j < this.meetings.length; j++){
          if(this.meetings[j].date == this.form.date && this.meetings[j].room == this.form.room && this.meetings[j].start <= times && this.meetings[j].end > times){
            used = true;
            data = this.meetings[j];
          }
        }
        this.timeLines.push({
          times: this.base_numToTime(times),
          data: data,
          type: used?'locked':'none'
        })
      }
      console.log(this.form.chooseTime)
    },
    choose(item){
      console.log(this.timeLines,this.form.chooseTime)
      if(item.type==='locked' && !this.form.unique){
        this.popMeeting.name = item.data.title;
        this.popMeeting.ownerName = item.data.ownerName;
        this.popMeeting.start = this.base_numToTime(item.data.start);
        this.popMeeting.end = this.base_numToTime(item.data.end);
        this.popMeeting.visible = true;
        this.form.chooseTime = false;
      }else{
        this.popMeeting.visible = false;
        this.form.startTimes = item.times;
        this.form.selected = item.times;
        this.form.chooseTime = true;
        console.log(this.form.chooseTime)
      }
    },
    check(){
      if(this.form.startTimes&&this.form.endTimes&&this.form.theme){
        this.form.waiting = false;
      }
    },
    roomChange(){
      this.$nextTick(()=>{
        this.form.chooseTime = false;
        this.initTimeLine();
      })
    },
    submit(){
      if(this.form.waiting){
        return;
      }
      if(!this.form.theme){
        this.base_tip('会议主题不能为空')
        return ;
      }else if(!this.form.start){
        this.base_tip('开始时间不能为空')
        return ;
      }else if(!this.form.end){
        this.base_tip('结束时间不能为空')
        return ;
      }
      if(this.form.start >= this.form.end){
        this.base_tip('会议结束时间必须大于开始时间')
      }else if(!this.form.unique){
        action.addMeeting({
          title: this.form.theme,
          description: this.form.description||'',
          owner: this.userInfo.userid,
          ownerName: this.userInfo.name,
          start: parseInt(this.form.startTimes.replace(/:/,'')),
          end: parseInt(this.form.endTimes.replace(/:/,'')),
          date: parseInt(this.form.date),
          type: 'once',
          room: this.rooms[this.form.room].id,
          roomName: this.rooms[this.form.room].name,
        }).then(d=>{
          if(d.status===200){
            this.form = {
              room: 0,
              chooseTime: false,
              waiting: true,
              selected: '',
              date: this.form.date
            };
            this.base_tip('预约成功')
            this.popAddShow = false;
            this.getMeetings();
          }else{
            this.base_tip(d.msg)
          }
        })
      }else{
        action.editMeeting({
          id: this.form.unique,
          title: this.form.theme,
          description: this.form.description||'',
          start: parseInt(this.form.startTimes.replace(/:/,'')),
          end: parseInt(this.form.endTimes.replace(/:/,'')),
          date: parseInt(this.form.date),
          type: 'once',
          room: this.rooms[this.form.room].id,
          roomName: this.rooms[this.form.room].name,
        }).then(d=>{
          if(d.status===200){
            this.form = {
              room: 0,
              chooseTime: false,
              waiting: true,
              selected: '',
              date: this.form.date
            };
            this.base_tip('更新成功')
            this.popAddShow = false;
            this.getMeetings();
          }else{
            this.base_tip(d.msg)
          }
        })
      }
    },
    editOne(item){
      this.form = {
        unique: item._id,
        title: item.title,
        chooseTime: false,
        waiting: true,
        selected: '',
        start: this.base_numToTime(item.start),
        end: this.base_numToTime(item.end),
        date: item.date,
        room: item.room
      }
      this.popAddShow = true;
    },
    delOne(item){
      Dialog.confirm({
        title: '是否确认删除',
        message: item.description
      }).then(()=>{
        action.delMeeting({id:item._id}).then(d=>{
          if(d.status===200){
            this.base_tip('会议已取消')
            this.getMeetings()
          }else{
            this.base_tip(d.message||'删除失败')
          }
        })
      }).catch(()=>{
        this.base_tip('取消删除')
      })
    },
    callOne(item){
      window.wx.invoke('openUserProfile', {
          "type": 1, //1表示该userid是企业成员，2表示该userid是外部联系人
          "userid": item.owner //可以是企业成员，也可以是外部联系人
        }, function(res){
        if(res.err_msg != "openUserProfile:ok"){
          this.base_tip('调起失败，请自行联系')
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  padding: 20px;
  font-size: 0;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 50px;
  &-btn{
    height: 70px;
    .btn{
      width: 200px;
      padding: 10px;
      font-size: 18px;
      position: fixed;
      top: 0;
      left: 50%;
      margin-left: -100px;
      margin-top: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 0 8px 4px rgba($color: #3aa7ff, $alpha: 0.1);
      text-align: center;
      line-height: 1.5;
      color: #3aa7ff;
      border: 1px solid #3aa7ff;
      cursor: pointer;
      z-index: 2;
      transition: all linear 0.1s;
    }
    .btn:hover{
      background: #e1ecf5;
      transition: all linear 0.1s;
    }
    .btn:active{
      background: #bcddf8;
      transition: all linear 0.1s;
    }
  }
  &-avatar{
    width: 60px;
    height: 60px;
    border-radius: 60px;
    overflow: hidden;
    position: fixed;
    top: 0;
    right: 20px;
    margin-top: 20px;
  }
  &-con{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .meeting{
    width: 100%;
    flex: 1;
    min-width: 300px;
    max-width: 350px;
    font-size: 14px;
    margin: 5px 5px 10px;
    border: 1px solid #eee;
    background-color: #fff;
    padding: 0;
    &.empty{
      height: 0px;
      border: 0;
    }
    &-date{
      padding: 4px;
      background: #66c6f2;
      text-align: left;
      color: #fff;
    }
    &-detail{
      padding: 10px 16px;
      border-bottom: 1px dashed #eee;
      position: relative;
      &-btn{
        position: absolute;
        top: 10px;
        right: 5px;
        white-space: nowrap;
        text-align: center;
        span{
          cursor: pointer;
          color: rgba(58,167,255,1);
          padding: 10px 5px;
          &.cancel{
            color: #999;
          }
        }
      }
      &-title{
        font-size: 16px;
        line-height: 1.5;
        .date{
          font-size: 14px;
          color: #999;
        }
        .title{
          font-size: 18px;
        }
        .description{
          font-size: 14px;
          color: #777;
        }
      }
      &-other{
        font-size: 14px;
        color: #333;
      }
      &:last-child{
        border: 0;
      }
    }
  }
}
.pop-add{
  font-size: 14px;
  text-align: left;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 380px;
  height: 380px;
  margin-left: -190px;
  margin-top: -250px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 12px 4px rgba($color: #000000, $alpha: 0.1);
  &-title{
    font-size: 14px;
    text-align: center;
    padding: 0 0 5px;
  }
  &-con{
    .time{
      padding: 0 5px 20px;
      z-index: 8;
      position: relative;
      &-line{
        display: flex;
        align-items: center;
        border-right: 1px solid #eee;
        span{
          cursor: pointer;
          flex: 1;
          height: 16px;
          background: #aaa;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          border-left: 1px solid #eee;
          &.none{
            background: rgba(58, 167, 255, 0.1);
          }
        }
      }
      &-num{
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        transform: scale(1.1);
        span{
          flex: 1;
          font-size: 12px;
          text-align: center;
          color: #999;
        }
      }
    }
    .week{
      padding: 10px 5px 10px;
      margin: 10px 0 0;
      z-index: 8;
      position: relative;
      &-line{
        display: flex;
        align-items: center;
        border-right: 1px solid #eee;
        span{
          cursor: pointer;
          flex: 1;
          height: 16px;
          background: #fff;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          border-left: 1px solid #eee;
          &.active{
            background: rgba(58, 167, 255, 0.1);
          }
        }
      }
      &-num{
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        span{
          flex: 1;
          font-size: 12px;
          text-align: center;
          color: #999;
        }
      }
    }
    .popMeeting{
      position: relative;
      z-index: 9;
      &-con{
        width: 160px;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 0 8px 2px rgba($color: #000000, $alpha: 0.06);
        border: 1px solid #eee;
        position: absolute;
        background: #fff;
        top: -16px;
        left: 50%;
        margin-left: -80px;
        text-align: center;
        h3{
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p{
          font-size: 12px;
        }
      }
    }
    .form{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 3px 0;
      &-label{
        width: 70px;
      }
      &-item{
        flex: 1;
        input[type=text]{
          width: 100%;
          height: 28px;
          border: 1px solid #eee;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.5;
        }
        input[type=date]{
          width: 160px;
          height: 28px;
          border: 1px solid #eee;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.5;
        }
        select{
          width: 80px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #eee;
          font-size: 14px;
          line-height: 1.5;
        }
        textarea{
          width: 100%;
          font-size: 14px;
          line-height: 1.5;
          resize: none;
        }
      }
    }
  }
  &-bottom{
    text-align: right;
    padding: 10px;
    .btn{
      cursor: pointer;
      display: inline-block;
      width: 70px;
      height: 28px;
      text-align: center;
      border: 1px solid #eee;
      margin: 0 5px;
      font-size: 12px;
      line-height: 26px;
      color: #666;
      border-radius: 4px;
      &.primary{
        color: #fff;
        background: rgba(58,167,255,1);
      }
      &.wait{
        color: #f4f4f4;
        background: rgba(58,167,255,0.5);
      }
    }
  }
}
</style>