from plone import api
from plone.i18n.normalizer import idnormalizer
from Products.Five import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from polklibrary.type.coursepages.utility import MailMe
import json, logging

logger = logging.getLogger("Plone")

class FeedView(BrowserView):

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        fmt = self.request.form.get('fmt','')
        callback = self.request.form.get('callback','?')
        
        if fmt == 'xml':
            return self.toXML(self.context.cached)
        if fmt == 'jsonp':
            return self.toJSONS(self.context.cached, callback)
        return self.context.cached
        
        
    def toJSONS(self, data, callback):
        return callback + '(' + data + ')'
        
    def toXML(self, data):
        return 'todo'
    
    @property
    def portal(self):
        return api.portal.get()