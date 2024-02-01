// Adds data easy formating - http://blog.stevenlevithan.com/archives/date-time-format
var dateFormat=function(){var h=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,c=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,g=/[^-+\dA-Z]/g,S=function(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t};return function(t,e,a){var m=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(t)||/\d/.test(t)||(e=t,t=void 0),t=t?new Date(t):new Date,isNaN(t))throw SyntaxError("invalid date");"UTC:"==(e=String(m.masks[e]||e||m.masks.default)).slice(0,4)&&(e=e.slice(4),a=!0);var d=a?"getUTC":"get",n=t[d+"Date"](),r=t[d+"Day"](),y=t[d+"Month"](),s=t[d+"FullYear"](),i=t[d+"Hours"](),o=t[d+"Minutes"](),u=t[d+"Seconds"](),M=t[d+"Milliseconds"](),l=a?0:t.getTimezoneOffset(),T={d:n,dd:S(n),ddd:m.i18n.dayNames[r],dddd:m.i18n.dayNames[r+7],m:y+1,mm:S(y+1),mmm:m.i18n.monthNames[y],mmmm:m.i18n.monthNames[y+12],yy:String(s).slice(2),yyyy:s,h:i%12||12,hh:S(i%12||12),H:i,HH:S(i),M:o,MM:S(o),s:u,ss:S(u),l:S(M,3),L:S(99<M?Math.round(M/10):M),t:i<12?"a":"p",tt:i<12?"am":"pm",T:i<12?"A":"P",TT:i<12?"AM":"PM",Z:a?"UTC":(String(t).match(c)||[""]).pop().replace(g,""),o:(0<l?"-":"+")+S(100*Math.floor(Math.abs(l)/60)+Math.abs(l)%60,4),S:["th","st","nd","rd"][3<n%10?0:(n%100-n%10!=10)*n%10]};return e.replace(h,function(t){return t in T?T[t]:t.slice(1,t.length-1)})}}();dateFormat.masks={default:"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},Date.prototype.format=function(t,e){return dateFormat(this,t,e)};

var OpenCalendar = {
    
    FriendlyDays : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    FriendlyMonths : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    
    Next : new Date(),
    
    Initialize : function(){
        this.Handlers();
        this.Show();
    },
    
    Handlers : function(){
        $('.calendar-back').on('click', function(){
            OpenCalendar.DecreaseWeek();
        });
        $('.calendar-next').on('click', function(){
            OpenCalendar.IncreaseWeek();
        });
    },
    
    IncreaseWeek : function(){
        var tmp = new Date(this.Next);
        this.Next = new Date(tmp.setDate(tmp.getDate() + 7)); 
        this.Show();
    },
    
    DecreaseWeek : function(){
        var tmp = new Date(this.Next);
        this.Next = new Date(tmp.setDate(tmp.getDate() - 7)); 
        this.Show();
    },
    
    Show : function(){
        var MaxHeight = 0;
        var ActiveLocation = 'campus-osh';
        if (typeof CampusLocation !== 'undefined')
            ActiveLocation = CampusLocation.Active;
        
        var TodayId = this.GetId(new Date());
        var StartDate = new Date(this.Next);
        
        $('.weekly-calendar').empty(); // wipe old data
        for (var i = 0; i < 7; i++){
            
            var Id = this.GetId(StartDate);            
            var FriendlyDay = this.FriendlyDays[StartDate.getDay()];
            var FriendlyMonth = this.FriendlyMonths[StartDate.getMonth()];
            var HTML = $('<div>').addClass('calendar-info').html('<div class="calendar-date">'+FriendlyMonth + ' ' + StartDate.getDate()+'</div><div class="calendar-day">('+FriendlyDay+')</div>');
            
            if (TodayId == Id)
                $(HTML).addClass('calendar-today');
            
            
            if (typeof HoursCache[ActiveLocation] !== 'undefined'){
                for (var j in HoursCache[ActiveLocation][Id]){
                    var hours = HoursCache[ActiveLocation][Id][j];
                    
                    var StartDT = new Date(hours.start * 1000);
                    var EndDT = new Date(hours.end * 1000);
                    
                    var FriendlyStartTime = this.NoonOrMidnight(StartDT.format("h:MMtt"));
                    var FriendlyEndTime = this.NoonOrMidnight(EndDT.format("h:MMtt"));
                    if (hours.message != ''){
                        $(HTML).append('<div class="calendar-message">'+hours.message+'</div>');
                    }
                    else if (hours.is_open) {
                        $(HTML).append('<div class="calendar-time">'+FriendlyStartTime+' to '+FriendlyEndTime+'</div>');
                    }
                    else {
                        $(HTML).append('<div class="calendar-time calendar-closed">Closed</div>');
                    }
                    
                }
                if (typeof HoursCache[ActiveLocation][Id] === 'undefined'){
                    $(HTML).append('<div class="calendar-time calendar-tbd">TBD</div>');
                }
            }
            
            
            
            $('.weekly-calendar').append(HTML);
            var h = $('.weekly-calendar .calendar-info').last().height();
            if (h > MaxHeight)
                MaxHeight = h;
            
            StartDate.setDate(StartDate.getDate() + 1); // next day
        }
        
        $('.weekly-calendar .calendar-info').height(MaxHeight);
       
    },
    
    GetId : function(DT){
        var Year = DT.getFullYear() + '';
        var Month = DT.getMonth() + 1; // 0-11
        if (Month < 10)
            Month = '0' + Month;
        var Day = DT.getDate();
        if (Day < 10)
            Day = '0' + Day;
        return Id = Year + '-' + Month + '-' + Day;
    },
    
    
    NoonOrMidnight : function(TimeString){
        return TimeString.replace('12:00am', 'Midnight').replace('12:00pm', 'Noon');
    },
    
    
    
}

$(document).ready(function(){
    OpenCalendar.Initialize();
});