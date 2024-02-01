from plone import api
from plone.indexer.decorator import indexer
from plone.app.textfield import RichText
from plone.namedfile.field import NamedBlobImage
from plone.supermodel import model
from zope import schema
from zope.schema.vocabulary import SimpleVocabulary, SimpleTerm


class IHours(model.Schema):

    title = schema.TextLine(
            title=u"Title",
            required=True,
        )
        
    description = schema.Text(
            title=u"Description",
            required=False,
        )
        
    prebody = RichText(
            title=u"Above Body",
            default_mime_type='text/structured',
            required=False,
            default=u"<p></p>",
        )
        
    body = RichText(
            title=u"Below Body",
            default_mime_type='text/structured',
            required=False,
            default=u"<p></p>",
        )
       
    csv = schema.Text(
            title=u"CSV Data",
            required=True,
        )
        
    cached = schema.Text(
            title=u"Cached Data",
            description=u"Empty this data to have cache rebuilt.",
            required=False,
        )
        
        