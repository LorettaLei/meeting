<template>
    <div class="calendar">
        <div class="calendar__month">
            <span class="calendar__month--prevy" @click.stop="prevYear()"></span>
            <span class="calendar__month--prev" @click.stop="prevMonth()"></span>
            <span class="calendar__month--curr">{{year}}-{{month > 8 ? (month+1):'0'+(month+1)}}</span>
            <span class="calendar__month--next" @click.stop="nextMonth()"></span>
            <span class="calendar__month--nexty" @click.stop="nextYear()"></span>
        </div>
        <div class="calendar__header">
            <span v-for="(item,index) in weekArr" :key="index">{{item}}</span>
        </div>
        <div class="calendar__con">
            <template v-for="item in dateArray">
                <div class="calendar__con--item" :key="item.timestamp" @click.stop="select(item)">
                    <span class="good" :class="{active:item.timestamp==time}" v-if="item.timestamp == today">今</span>
                    <span class="good" :class="{active:item.timestamp==time}" v-else-if="item.timestamp > today">{{item.day}}</span>
                    <span v-else :class="{active:item.timestamp==time}">{{item.day}}</span>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    model:{
        prop: 'time',
        event: 'chooseDate'
    },
    props:{
        time:{
            type: Number,
            default: 10
        }
    },
    data(){
        return {
            year: 2019, //当前日期 -年
            month: 8, //当前日期 -月
            day: 26, //当前日期 -日
            today: new Date().getTime(),
            dateArray: [],
            weekArr: ['日','一','二','三','四','五','六']
        }
    },
    created(){
        let date = new Date(this.time);
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();
        let today = new Date();
        this.today = new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
        this.initMonthDays();
    },
    methods:{
        prevMonth(){
            if(this.month > 0){
                this.month = this.month - 1;
            }else{
                this.month = 11;
                this.year = this.year - 1;
            }
            this.initMonthDays();
        },
        nextMonth(){
            if(this.month < 11){
                this.month = this.month + 1;
            }else{
                this.month = 0;
                this.year = this.year + 1;
            }
            this.initMonthDays();
        },
        prevYear(){
            this.year = this.year - 1;
            this.initMonthDays();
        },
        nextYear(){
            this.year = this.year + 1;
            this.initMonthDays();
        },
        initMonthDays(){
            // let active = new Date(this.year,this.month,this.day);
            let dayLength = new Date(this.year,this.month+1, 0).getDate();
            let prevDayLength = new Date(this.year,this.month, 1).getDay();
            this.dateArray=[];
            let date;
            for(let j = prevDayLength-1;j>=0;j--){
                date = new Date(this.year,this.month,-j);
                this.dateArray.push({
                    year: this.year,
                    month: this.month-1,
                    day: date.getDate(),
                    timestamp: date.getTime(),
                })
            }
            for(let j=0;j<dayLength;j++){
                this.dateArray.push({
                    year: this.year,
                    month: this.month,
                    day: j+1,
                    timestamp: new Date(this.year,this.month,j+1).getTime(),
                })
            }
        },
        select(item){
            this.$emit('chooseDate',new Date(item.year,item.month,item.day).getTime());
            this.$emit('choose',new Date(item.year,item.month,item.day).getTime());
        }
    }
}
</script>

<style lang="scss" scoped>
.calendar{
    padding: 20px 14px 10px;
    &__month{
        text-align: center;
        color: #5F6379;
        font-size: 16px;
        font-weight: 600;
        line-height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        &--prev::before,&--next::before{
            display: block;
            content: '';
        }
        &--prevy::before,&--nexty::before,
        &--prevy::after,&--nexty::after{
            display: block;
            content: '';
        }
        &--curr{
            margin: 0 20px;
        }
        &--prev,&--next{
            width: 40px;
            height: 40px;
            position: relative;
        }
        &--prev::before,&--next::before{
            width: 10px;
            height: 10px;
            border: 2px solid #5F6379;
            border-width: 0 0 2px 2px;
            position: absolute;
            top: 14px;
            left: 14px;
            transform: rotate(45deg);
        }
        &--prevy,&--nexty{
            width: 40px;
            height: 40px;
            position: relative;
        }
        &--prevy::before,&--nexty::before,
        &--prevy::after,&--nexty::after{
            width: 10px;
            height: 10px;
            border: 2px solid #5F6379;
            border-width: 0 0 2px 2px;
            position: absolute;
            top: 14px;
            left: 14px;
            transform: rotate(45deg);
        }
        &--prevy::after,&--nexty::after{
            left: 10px;
        }
        &--next::before{
            transform: rotate(-135deg);
        }
        &--nexty::before,
        &--nexty::after{
            transform: rotate(-135deg);
        }
    }
    &__header{
        font-size: 14px;
        font-weight: 600;
        color: #5F6379;
        line-height: 20px;
        padding: 10px 0 14px;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    &__con{
        font-size: 0;
        height: 208px;
        &--item{
            width: 14.28%;
            padding: 4px 0;
            text-align: center;
            float: left;
            span{
                display: inline-block;
                width: 35px;
                height: 35px;
                border-radius: 2px;
                font-size:14px;
                font-weight: 500;
                line-height: 35px;
                text-align: center;
                color: #aaa;
                background: #eee;
                cursor: pointer;
            }
            .today{
                background: #3AA7FF;
                box-shadow:0px 10px 6px -5px rgba(61,139,255,0.4);
                color: #fff;
            }
            .good{
                background:#fff;
                color: #5F6379;
                border: 1px solid #fff;
                &:hover{
                    border: 1px solid #eee;
                }
            }
            .active{
                background:#e7f2fb;
                color: #5F6379;
                border: 1px solid #a7d2f5;
                &:hover{
                    border: 1px solid #3AA7FF;
                }
            }
        }
    }
    &__con::after{
        display: block;
        content: '';
        clear: both;
    }
}
</style>