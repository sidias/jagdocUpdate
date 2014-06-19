importClass(Packages.org.apache.solr.client.solrj.SolrQuery);
importClass(Packages.org.apache.solr.client.solrj.SolrServerException);
importClass(Packages.org.apache.solr.client.solrj.impl.CommonsHttpSolrServer);
importClass(Packages.org.apache.solr.client.solrj.response.QueryResponse);
importClass(Packages.org.apache.solr.common.SolrDocumentList);
importClass(Packages.org.apache.solr.common.SolrInputDocument);

var IOException = java.io.IOException;
var ArrayList   = java.util.ArrayList;
var Collection  = java.util.Collection;

var url = "http://localhost:8983/solr"; //need to change this when we put into server
var server ;

var result = function (searchParameter) {

    var solr = new CommonsHttpSolrServer(url);

    var query = new SolrQuery();
    query.setQuery(String(searchParameter));
    //query.addSortField("price", SolrQuery.ORDER.asc);
    //query.setHighlight(true).setHighlightSnippets(1);
    //query.setParam("hl.fl", "document");

    /*auto creation of a query
     * SolrQuery solrQuery = new  SolrQuery().
     setQuery("ipod").
     setFacet(true).
     setFacetMinCount(1).
     setFacetLimit(8).
     addFacetField("category").
     addFacetField("inStock");
     QueryResponse rsp = server.query(solrQuery);*/
    var res = [],
        tmpUrl,
        hasquery;

    var response = solr.query(query);
    var results = response.getResults();
    var log = new Log();

    for (var i = 0; i < results.size(); ++i) {
        var obj = {};
        obj.key = results.get(i).getFieldValue("id");
        //obj.url = results.get(i).getFieldValue("manu");

        tmpUrl = String(results.get(i).getFieldValue("manu"));
        hasquery = tmpUrl.indexOf('?');

        if (hasquery == -1) {
            tmpUrl = tmpUrl.concat("?keyword=" + searchParameter);
        } else {
            tmpUrl = tmpUrl.concat("&keyword=" + searchParameter);
        }

        obj.url = tmpUrl;
        res[i] = obj;
    }
    return res;
}


var index = function (contentSet) {
    var csLength = contentSet.length;
    var docs = new ArrayList();
    var content, doc;

    server = new CommonsHttpSolrServer(url);

    server.setMaxRetries(1);
    server.setConnectionTimeout(5000);

    for(var k = 0; k < csLength; k++) {
        content = contentSet[k];

        doc = new SolrInputDocument();
        doc.addField( "id", content.key);
        doc.addField( "name", content.content);
        doc.addField( "manu", content.url);

        docs.add(doc);
    }

    server.add(docs);
    var state = server.commit();
    return (state.getStatus());

}

