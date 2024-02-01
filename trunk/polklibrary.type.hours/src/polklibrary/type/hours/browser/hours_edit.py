from plone import api
from plone.i18n.normalizer import idnormalizer
from plone.protect.interfaces import IDisableCSRFProtection
from Products.Five import BrowserView
from zope.interface import alsoProvides
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from polklibrary.type.coursepages.utility import MailMe
import json, logging, csv, io, datetime, time, json

logger = logging.getLogger("Plone")

class HoursEdit(BrowserView):

    template = ViewPageTemplateFile("hours_edit.pt")

    def __call__(self):
        #alsoProvides(self.request, IDisableCSRFProtection)
        
        if self.request.form.get('hours.edit.save', None):
            newcsv = self.request.form.get('hours.csv','')
            self.context.csv = newcsv
            self.context.reindexObject()
            api.portal.show_message(message='Hours Saved', request=self.request)
            self.csv_to_cache(self.context)
            
        return self.template()


    def get_csv_json(self):
        data = {}
        reader = csv.reader(io.StringIO(self.context.csv), csv.excel)
        for library, startdate, start, end, message in reader:
            data[library + '--' + startdate] = library + ',' + startdate + ',' + start + ',' + end + ',' + message
        return json.dumps(data)
    
    
    def csv_to_cache(self, obj):
        cache = {}
        reader = csv.reader(io.StringIO(obj.csv), csv.excel)
        for library, startdate, start, end, message in reader:
                    
            lm = library.encode('ascii','ignore').decode('ascii')
            
            # if library doesn't exist, add it
            if lm not in cache:
                cache[lm] = {}
            
            # if startdate doesn't exist, add it
            if startdate not in cache[lm]:
                cache[lm][startdate] = []
                
            start_timestamp = ""
            end_timestamp = ""
            is_open = (start != '' and end != '')
            
            #defaults 
            start_dt = datetime.datetime.strptime("2020-01-01 01:00", '%Y-%m-%d %H:%M')
            end_dt = datetime.datetime.strptime("2020-01-01 01:00", '%Y-%m-%d %H:%M')
            
            if is_open:
                start_dt = datetime.datetime.strptime(startdate + ' ' + start, '%Y-%m-%d %H:%M')
                end_dt = datetime.datetime.strptime(startdate + ' ' + end, '%Y-%m-%d %H:%M')
                if end == '00:00' or end == '0:00' or end == '0':
                    end_dt = end_dt + datetime.timedelta(days=1)

            cache[lm][startdate].append({
                'start': int(time.mktime(start_dt.timetuple())),
                'end': int(time.mktime(end_dt.timetuple())),
                'message': message,
                'is_open': is_open,
                'tz': '',
            })
        
        # should only run once if it was purged by the user.
        with api.env.adopt_roles(roles=['Manager']):
            self.context.cached = json.dumps(cache)
            self.context.reindexObject()
            
    @property
    def portal(self):
        return api.portal.get()
         