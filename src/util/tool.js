export default  {
    install(Vue) {
        /**
         * 时间撮转日期简写2019.01.01
         *  */
        Vue.prototype.base_timeToDate = function (timestamp) {
            var time = new Date(parseInt(timestamp));
            return time.getFullYear()+'.'+(time.getMonth()+1>9?time.getMonth()+1:'0'+(time.getMonth()+1)) +'.'+ (time.getDate()>9?time.getDate():'0'+time.getDate())
        },
        /**
         * 时间撮转日期简写2019-01-01
         *  */
        Vue.prototype.base_timeToDate1 = function (timestamp) {
            var time = new Date(parseInt(timestamp));
            return time.getFullYear()+'-'+(time.getMonth()+1>9?time.getMonth()+1:'0'+(time.getMonth()+1)) +'-'+ (time.getDate()>9?time.getDate():'0'+time.getDate())
        },
        /**
         * 时间撮转时间点格式 05:01
         *  */
        Vue.prototype.base_timeToTime = function (timestamp) {
            var time = new Date(parseInt(timestamp));
            return (time.getHours() > 9 ? time.getHours() : '0' + time.getHours()) + ':' + (time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes())
        },
        /**
         * 数字转时间点格式 0510 --> 05:01
         *  */
        Vue.prototype.base_numToTime = function (num) {
            return (num + '').slice(0, 2) + ':' + (num + '').slice(2, 4);
        },
        /**
         * 数字转日期格式 20200910 --> 2020.09.10
         *  */
        Vue.prototype.base_numToDate = function (num) {
            return (num + '').slice(0, 4) + '.' + (num + '').slice(4, 6) + '.' + (num + '').slice(6, 8);
        },
        /**
         * 数字转周几 20200910 --> 周一
         *  */
        Vue.prototype.base_numToWeek = function (num) {
            let weeks = ['周日','周一', '周二', '周三', '周四', '周五', '周六'];
            let date = (num + '').slice(0, 4) + '/' + (num + '').slice(4, 6) + '/' + (num + '').slice(6, 8);
            return weeks[new Date(date).getDay()];
        },
        /**
         * 小提示
         *  */
        Vue.prototype.base_tip = function (msg) {
            let div = document.createElement('div');
            div.className = 'base-tip';
            div.innerHTML = msg;
            document.getElementsByTagName('body')[0].appendChild(div);
            setTimeout(() => {
                document.getElementsByTagName('body')[0].removeChild(div);
            }, 3000)
        }
    }
}
