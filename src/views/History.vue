<template>
    <div class="history">
        <list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onload">
            <div class="history-con">
                <div class="meeting" v-for="ele in historys" :key="ele._id">
                    <div class="meeting-detail">
                        <div class="meeting-detail-title">
                            <p class="title">{{ele.title}}</p>
                            <p class="description">{{ele.description}}</p>
                        </div>
                        <div class="meeting-detail-other">
                            <p class="time">{{base_numToDate(ele.date)}}</p>
                            <p>{{base_numToTime(ele.start)}} - {{base_numToTime(ele.end)}}</p>
                            <p>预约人：{{ele.ownerName}}</p>
                        </div>
                    </div>
                </div>
                <div class="empty meeting"></div>
                <div class="empty meeting"></div>
            </div>
        </list>
    </div>
</template>
<script>
import action from '../store/action'
import 'vant/lib/list/index.css'
import { List } from 'vant'
export default {
    components: {List},
    data(){
        return {
            historys: [],
            pager: {
                pageNo: 1,
                total: 0
            },
            loading: false,
            finished: true,
        }
    },
    created(){
        this.getHistorys();
    },
    methods:{
        getHistorys(){
            this.loading = true;
            action.getHistorys({pageNo: this.pager.pageNo, pageSize:12}).then(d=>{
                this.loading = false;
                if(d.status==200){
                    this.historys = this.historys.concat(d.result);
                    if(d.total===this.historys.length){
                        this.finished = true;
                    }else{
                        this.finished = false;
                    }
                }else{
                    this.finished = true;
                    this.base_tip(d.message)
                }
            })
        },
        onload(){
            this.pager.pageNo++;
            this.getHistorys();
        }
    }
}
</script>
<style lang="scss" scoped>
.history{
    padding: 20px;
    font-size: 0;
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
    padding-bottom: 50px;
    &-con{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
  .meeting{
    width: 100%;
    flex: 1;
    min-width: 400px;
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
        color: #666;
      }
      &:last-child{
        border: 0;
      }
    }
  }
}
</style>