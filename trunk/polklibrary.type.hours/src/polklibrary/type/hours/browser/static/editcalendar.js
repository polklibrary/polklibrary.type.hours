var HoursEditor = {
    
    construct : function(){
        console.log('Hours Editor Ready');
        this.date_change();
        this.time_picker();
        this.save_btn();
        this.closed_btn();
        this.rebuild_sort_csv();
    },
    
    determine_closed_vs_open : function(){
        var osh_open = $('.osh-open-hours').hasClass('time-good') && $('.osh-closed-hours').hasClass('time-good');
        if (osh_open){
            $('.osh-is-open').show();
            $('.osh-is-closed').hide();
        }
        else{
            $('.osh-is-open').hide();
            $('.osh-is-closed').show();
        }
        
        var fond_open = $('.fond-open-hours').hasClass('time-good') && $('.fond-closed-hours').hasClass('time-good');
        if (fond_open){
            $('.fond-is-open').show();
            $('.fond-is-closed').hide();
        }
        else{
            $('.fond-is-open').hide();
            $('.fond-is-closed').show();
        }
        
        var fox_open = $('.fox-open-hours').hasClass('time-good') && $('.fox-closed-hours').hasClass('time-good');
        
        if (fox_open){
            $('.fox-is-open').show();
            $('.fox-is-closed').hide();
        }
        else{
            $('.fox-is-open').hide();
            $('.fox-is-closed').show();
        }
    },
    
    save_btn : function(){
        $('#hours-editor-save').on('click',function(){
            HoursEditor.replace_or_add_hours();
            $('#hours-editor').hide();
        });  
    },
    
    closed_btn : function(){
        $('.osh-closed-btn').on('click',function(){
            $('.osh-open-hours,.osh-closed-hours,.osh-message-hours').val('');
            HoursEditor.validate_all_inputs();
        });
        $('.fond-closed-btn').on('click',function(){
            $('.fond-open-hours,.fond-closed-hours,.fond-message-hours').val('');
            HoursEditor.validate_all_inputs();
        });
        $('.fox-closed-btn').on('click',function(){
            $('.fox-open-hours,.fox-closed-hours,.fox-message-hours').val('');
            HoursEditor.validate_all_inputs();
        });
        
    },
    
    time_picker : function(){
        $("input.hours-time").on('keyup',function(){
            var clean = $.trim($(this).val()).replace(/[^0-9:]$/g,'');
            if (clean.length > 4)
                clean = clean.substring(0,5);
            //if (clean.length == 2)
              //  clean += ':';
            $(this).val(clean);
            HoursEditor.validate_input(this);
        });
    },
    
    validate_input : function(t){
        var v = $(t).val();
        if (v == '' || typeof v === "undefined" || v == null)
            $(t).removeClass('time-good').removeClass('time-error');
        else if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(v))
            $(t).addClass('time-good').removeClass('time-error');
        else
            $(t).addClass('time-error').removeClass('time-good');
        
        this.determine_closed_vs_open();
    },
    
    validate_all_inputs : function(){
        $("input.hours-time").each(function(i,t){
            HoursEditor.validate_input(t);
        });
    },
    
    date_change : function(){
        // Timeout due to pattern setting up
        $(document).on('input propertychange change', 'input.pattern-pickadate-date' , function(){
            var datestr = $('#content-core input.pattern-pickadate-date').val();
            $('#hours-editor').show();
            HoursEditor.find_existing_hours(datestr);
            HoursEditor.validate_all_inputs();
        });
    },
    
    
    
    
    // Hours Handler ================================================
    
    find_existing_hours : function(datestr){
        
        var oshdata = HoursCSVCache['campus-osh--' + datestr].split(',');
        $('.osh-open-hours').val(oshdata[2]);
        $('.osh-closed-hours').val(oshdata[3]);
        $('.osh-message-hours').val(oshdata[4]);
        
        var foxdata = HoursCSVCache['campus-fox--' + datestr].split(',');
        $('.fox-open-hours').val(foxdata[2]);
        $('.fox-closed-hours').val(foxdata[3]);
        $('.fox-message-hours').val(foxdata[4]);
        
        var fonddata = HoursCSVCache['campus-fond--' + datestr].split(',');
        $('.fond-open-hours').val(fonddata[2]);
        $('.fond-closed-hours').val(fonddata[3]);
        $('.fond-message-hours').val(fonddata[4]);
        
    },
    
    replace_or_add_hours : function(){
        var datestr = $('#content-core input.pattern-pickadate-date').val();
        
        var oshdata = "campus-osh," + datestr + ",";
        oshdata += $('.osh-open-hours').val() + ",";
        oshdata += $('.osh-closed-hours').val() + ",";
        oshdata += $('.osh-message-hours').val();
        HoursCSVCache["campus-osh--" + datestr] = oshdata;
        
        var foxdata = "campus-fox," + datestr + ",";
        foxdata += $('.fox-open-hours').val() + ",";
        foxdata += $('.fox-closed-hours').val() + ",";
        foxdata += $('.fox-message-hours').val();
        HoursCSVCache["campus-fox--" + datestr] = foxdata;
        
        var fonddata = "campus-fond," + datestr + ",";
        fonddata += $('.fond-open-hours').val() + ",";
        fonddata += $('.fond-closed-hours').val() + ",";
        fonddata += $('.fond-message-hours').val();
        HoursCSVCache["campus-fond--" + datestr] = fonddata;
        
        this.rebuild_sort_csv();
    },
    
    rebuild_sort_csv : function(){
        var ordered = {};
        Object.keys(HoursCSVCache).sort().forEach(function(key) {
            ordered[key] = HoursCSVCache[key];
        });
        HoursCSVCache = ordered;
        
        var output = "";
        for(var i in HoursCSVCache)
            output += HoursCSVCache[i] + '\n';
        
        $('textarea[name="hours.csv"]').val(output.substring(0, output.length - 1));
    },
    
    
    
    
    
}

$(document).ready(function(){
    
    HoursEditor.construct();
    
});
